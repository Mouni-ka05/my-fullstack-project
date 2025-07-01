package com.smartcomplaint.municipal.controller;

import com.smartcomplaint.municipal.entity.Complaint;
import com.smartcomplaint.municipal.entity.User;
import com.smartcomplaint.municipal.repository.ComplaintRepository;
import com.smartcomplaint.municipal.repository.UserRepository;
import com.smartcomplaint.municipal.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private ComplaintRepository complaintRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private EmailService emailService;



    // ✅ 1. Get all complaints
    @GetMapping("/complaints")
    public List<Complaint> getAllComplaints() {
        return complaintRepo.findAll();
    }

    // ✅ 2. Update status (optional if you're using resolve endpoint separately)
    @PostMapping("/update-status/{id}")
    public String updateStatus(@PathVariable int id, @RequestParam String status) {
        Complaint complaint = complaintRepo.findById(id).orElse(null);
        if (complaint != null) {
            complaint.setStatus(status);
            complaintRepo.save(complaint);
            return "Status updated";
        }
        return "Complaint not found";
    }

    // ✅ 3. Reply to a complaint
    @PostMapping("/reply")
    public ResponseEntity<Map<String, String>> replyToComplaint(@RequestBody Map<String, String> data) {
        try {
            int id = Integer.parseInt(data.get("id"));
            String reply = data.get("reply");

            Optional<Complaint> optionalComplaint = complaintRepo.findById(id);
            if (optionalComplaint.isPresent()) {
                Complaint complaint = optionalComplaint.get();
                complaint.setReply(reply);
                complaintRepo.save(complaint);

                // 🔹 Send email to user
                User user = userRepo.findByUsername(complaint.getUsername()).orElse(null);
                if (user != null) {
                    String subject = "Reply Received for Your Complaint (ID: " + complaint.getId() + ")";
                    String body = "Dear " + user.getFirstName() + ",\n\n"
                            + "An update has been made to your complaint:\n\n"
                            + "Reply: " + reply + "\n\n"
                            + "Regards,\nSmartSeva Municipal Team";
                    emailService.sendSimpleMail(user.getEmail(), subject, body);
                }

                return ResponseEntity.ok(Map.of("message", "Reply sent successfully."));
            } else {
                return ResponseEntity.status(404).body(Map.of("message", "Complaint not found."));
            }

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", "Error processing reply."));
        }
    }


    // ✅ 4. Mark complaint as resolved
    @PostMapping("/resolve")
    public ResponseEntity<Map<String, String>> resolveComplaint(@RequestBody Map<String, Integer> data) {
        try {
            int id = data.get("id");

            Optional<Complaint> optionalComplaint = complaintRepo.findById(id);
            if (optionalComplaint.isPresent()) {
                Complaint complaint = optionalComplaint.get();
                complaint.setStatus("Resolved");
                complaintRepo.save(complaint);

                // 🔹 Send email to user
                User user = userRepo.findByUsername(complaint.getUsername()).orElse(null);
                if (user != null) {
                    String subject = "Your Complaint Has Been Resolved (ID: " + complaint.getId() + ")";
                    String body = "Dear " + user.getFirstName() + ",\n\n"
                            + "Your complaint has been marked as resolved.\n\n"
                            + "Service Type: " + complaint.getServiceType() + "\n"
                            + "Issue: " + complaint.getIssueType() + "\n"
                            + "Reply: " + complaint.getReply() + "\n"
                            + "Status: Resolved\n\n"
                            + "Thank you for using SmartSeva.\n\n"
                            + "Regards,\nSmartSeva Team";
                    emailService.sendSimpleMail(user.getEmail(), subject, body);
                }

                return ResponseEntity.ok(Map.of("message", "Complaint marked as resolved."));
            } else {
                return ResponseEntity.status(404).body(Map.of("message", "Complaint not found."));
            }

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", "Error processing resolution."));
        }
    }


    // ✅ 5. Get all users with role USER only
    @GetMapping("/users")
    public List<User> getAllRegularUsers() {
        return userRepo.findByRole(User.Role.USER); // ✅ FIX: use enum, not string
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        Optional<User> user = userRepo.findById(id);
        if (user.isPresent()) {
            userRepo.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully."));
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "User not found."));
        }
    }


    @GetMapping("/reports")
    public ResponseEntity<Map<String, Long>> generateReport() {
        try {
            long totalUsers = userRepo.findByRole(User.Role.USER).size();
            List<Complaint> complaints = complaintRepo.findAll();

            long totalComplaints = complaints.size();
            long resolvedComplaints = complaints.stream()
                    .filter(c -> "Resolved".equalsIgnoreCase(c.getStatus()))
                    .count();
            long pendingComplaints = complaints.stream()
                    .filter(c -> "Pending".equalsIgnoreCase(c.getStatus()))
                    .count();

            Map<String, Long> report = new HashMap<>();
            report.put("totalUsers", totalUsers);
            report.put("totalComplaints", totalComplaints);
            report.put("resolvedComplaints", resolvedComplaints);
            report.put("pendingComplaints", pendingComplaints);

            return ResponseEntity.ok(report);

        } catch (Exception e) {
            e.printStackTrace(); // ✅ This will log the exact backend error
            return ResponseEntity.status(500).body(null); // Fallback response
        }
    }

}
