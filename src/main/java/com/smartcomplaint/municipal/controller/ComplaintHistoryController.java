package com.smartcomplaint.municipal.controller;

import com.smartcomplaint.municipal.entity.Complaint;
import com.smartcomplaint.municipal.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintHistoryController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @GetMapping("/user/{username}")
    public List<Complaint> getUserComplaints(@PathVariable String username) {
        return complaintRepository.findByUsername(username);
    }
}
