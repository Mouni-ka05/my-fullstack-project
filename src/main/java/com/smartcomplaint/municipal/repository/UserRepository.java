package com.smartcomplaint.municipal.repository;

import com.smartcomplaint.municipal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional; // ✅ Required import

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);  // ✅ Login use-case
    List<User> findByRole(User.Role role);           // ✅ To filter out ADMIN
    boolean existsByUsername(String username);
}
