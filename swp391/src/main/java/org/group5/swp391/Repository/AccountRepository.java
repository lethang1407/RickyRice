package org.group5.swp391.Repository;

import org.group5.swp391.Entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, String> {
    public Account findByUsername(String username);

    public List<Account> findByRole_Code(String roleCode); // Tìm tài khoản có vai trò là "STORE_OWNER"

}
