package com.smartcomplaint.municipal.controller;

import com.smartcomplaint.municipal.dto.ComplaintRequestDTO;
import com.smartcomplaint.municipal.entity.Complaint;
import com.smartcomplaint.municipal.entity.User;
import com.smartcomplaint.municipal.repository.ComplaintRepository;
import com.smartcomplaint.municipal.repository.UserRepository;
import com.smartcomplaint.municipal.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService; // ✅ Fixed semicolon

    @PostMapping("/complaints")
    public ResponseEntity<?> submitComplaint(@RequestBody ComplaintRequestDTO request) {
        Optional<User> optionalUser = userRepository.findByUsername(request.getUsername());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(400).body("{\"message\":\"User does not exist\"}");
        }
        User user = optionalUser.get();

        Complaint complaint = new Complaint();
        complaint.setUsername(request.getUsername());
        complaint.setServiceType(request.getServiceType());
        complaint.setIssueType(request.getIssueType());
        complaint.setAdditionalDesc(request.getDescription());
        complaint.setStatus("Pending");

        if (request.getAddress() != null) {
            complaint.setHouseNo(request.getAddress().getHouseNo());
            complaint.setStreet(request.getAddress().getStreet());
            complaint.setLandmark(request.getAddress().getLandmark());
            complaint.setCity(request.getAddress().getCity());
            complaint.setPincode(request.getAddress().getPincode());
        }

        complaintRepository.save(complaint);

        try {
            String subject = "Complaint Submitted Successfully";
            String body = "Dear " + user.getFirstName() + ",\n\n" +
                    "Your complaint has been registered successfully with the following details:\n\n" +
                    "Service Type: " + complaint.getServiceType() + "\n" +
                    "Issue: " + complaint.getIssueType() + "\n" +
                    "Status: " + complaint.getStatus() + "\n\n" +
                    "We will keep you updated with the progress.\n\n" +
                    "Regards,\nSmartSeva Municipal Team";

            emailService.sendSimpleMail(user.getEmail(), subject, body);
        } catch (Exception e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
        }

        Map<String, String> res = new HashMap<>();
        res.put("message", "Complaint submitted successfully");
        return ResponseEntity.ok(res);
    }
}
