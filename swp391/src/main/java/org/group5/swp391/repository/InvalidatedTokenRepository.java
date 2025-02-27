package org.group5.swp391.repository;

import org.group5.swp391.entity.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, String> {
    public boolean existsById(String id);
}
