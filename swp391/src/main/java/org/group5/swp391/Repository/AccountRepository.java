package org.group5.swp391.Repository;

import org.group5.swp391.Entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, String> {
    public Account findByUsername(String username);
}
