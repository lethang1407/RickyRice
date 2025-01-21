package org.group5.swp391.Service;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.Entity.Account;
import org.group5.swp391.Repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;

    public List<Account> getAccountsByRole(String roleCode) {
        return accountRepository.findByRole_Code(roleCode);  // Trả về danh sách tài khoản có vai trò "STORE_OWNER"
    }
}
