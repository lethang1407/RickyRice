package org.group5.swp391.Repository;

import org.group5.swp391.Entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, String> {
    public Optional<Role> findByCode(String code);
}
