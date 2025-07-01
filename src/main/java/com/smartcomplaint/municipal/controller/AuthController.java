package com.smartcomplaint.municipal.controller;

import com.smartcomplaint.municipal.entity.Complaint;
import com.smartcomplaint.municipal.entity.User;
import com.smartcomplaint.municipal.repository.ComplaintRepository;
import com.smartcomplaint.municipal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return "Username already exists!";
        }
        userRepository.save(user);
        return "Registered successfully!";
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user) {
        Optional<User> optionalUser = userRepository.findByUsername(user.getUsername());

        Map<String, Object> response = new HashMap<>();

        if (optionalUser.isPresent()) {
            User existing = optionalUser.get();
            if (existing.getPassword().equals(user.getPassword()) && existing.getRole() == User.Role.USER) {
                response.put("message", "User login successful!");
                response.put("username", existing.getUsername());
                response.put("profileCompleted", existing.isProfileCompleted());
                return ResponseEntity.ok(response);
            }
        }

        response.put("message", "Invalid credentials!");
        return ResponseEntity.status(401).body(response);
    }


    @PostMapping("/admin-login")
    public ResponseEntity<Map<String, String>> adminLogin(@RequestBody User user) {
        Optional<User> optionalUser = userRepository.findByUsername(user.getUsername());
        Map<String, String> response = new HashMap<>();

        if (optionalUser.isPresent()) {
            User existing = optionalUser.get();
            if (existing.getPassword().equals(user.getPassword()) && existing.getRole() == User.Role.ADMIN) {
                response.put("message", "Admin login successful");
                return ResponseEntity.ok(response);
            }
        }

        response.put("message", "Invalid admin credentials");
        return ResponseEntity.status(401).body(response);
    }

}
