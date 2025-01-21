package org.group5.swp391.Controller;

import org.group5.swp391.DTO.Response.AccountResponse;
import org.group5.swp391.Entity.Account;
import org.group5.swp391.Repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class AdminAPI {

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping("/account_owner")
    public ResponseEntity<List<AccountResponse>> getAccountOwner() {
        // Tìm các account có role là "STORE_OWNER"
        List<Account> accounts = accountRepository.findByRole_Code("STORE_OWNER");

        // Ánh xạ Account thành AccountResponse
        List<AccountResponse> accountResponse = accounts.stream()
                .map(account -> new AccountResponse(
                        account.getUsername(),
                        account.getEmail(),
                        account.getPhoneNumber(),
                        account.getAvatar(),
                        account.getCreatedAt(),
                        account.getIsActive(),
                        account.getGender(),
                        account.getBirthDate()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(accountResponse);
    }
}
