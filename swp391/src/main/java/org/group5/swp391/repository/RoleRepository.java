package org.group5.swp391.repository;

import org.group5.swp391.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, String> {
    public Optional<Role> findByCode(String code);
}
