package com.smartcomplaint.municipal.repository;

import com.smartcomplaint.municipal.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Integer> {
    List<Complaint> findByUsername(String username);
}
