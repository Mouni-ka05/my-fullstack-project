package com.smartcomplaint.municipal.controller;

import com.smartcomplaint.municipal.dto.ProfileData;
import com.smartcomplaint.municipal.entity.User;
import com.smartcomplaint.municipal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getProfile(@PathVariable String username) {
        return userRepository.findByUsername(username)
                .<ResponseEntity<?>>map(user -> {
                    Map<String, Object> profile = new HashMap<>();
                    profile.put("firstName", user.getFirstName());
                    profile.put("lastName", user.getLastName());
                    profile.put("phone", user.getPhone());
                    profile.put("email", user.getEmail());
                    profile.put("address", user.getAddress());
                    profile.put("profileCompleted", user.isProfileCompleted());  // ✅ This line is important
                    return ResponseEntity.ok(profile);
                })
                .orElse(ResponseEntity.status(404).body("User not found"));
    }


    @PostMapping("/update-profile")
    public ResponseEntity<String> updateProfile(@RequestBody ProfileData updatedData) {
        Optional<User> optionalUser = userRepository.findByUsername(updatedData.getUsername());
        if (optionalUser.isEmpty()) return ResponseEntity.badRequest().body("User not found.");

        User user = optionalUser.get();
        user.setFirstName(updatedData.getFirstName());
        user.setLastName(updatedData.getLastName());
        user.setPhone(updatedData.getPhone());
        user.setEmail(updatedData.getEmail());
        user.setAddress(updatedData.getAddress());
        user.setProfileCompleted(true); // ✅ This now won't error

        userRepository.save(user);
        return ResponseEntity.ok("Profile updated successfully");
    }


}
