package org.group5.swp391.Repository;

import org.group5.swp391.Entity.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, String> {
    public boolean existsById(String id);
}
