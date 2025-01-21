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

    // Trả về danh sách tài khoản theo role
    public List<Account> getAccountsByRole(String roleCode) {
        return accountRepository.findByRole_Code(roleCode);
    }
}
