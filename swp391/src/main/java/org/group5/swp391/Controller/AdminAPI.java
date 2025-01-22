package org.group5.swp391.Controller;

import org.group5.swp391.DTO.Response.AccountResponse;
import org.group5.swp391.Entity.Account;
import org.group5.swp391.Service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class AdminAPI {

    @Autowired
    private AccountService accountService;

    @GetMapping("/account_owner")
    public ResponseEntity<List<AccountResponse>> getAccountOwner() {
        // Lấy các account có role là "STORE_OWNER"
        List<Account> accounts = accountService.getAccountsByRole("STORE_OWNER");


        // Ánh xạ Account thành AccountResponse
        List<AccountResponse> accountResponse = accounts.stream()
                .map(account -> new AccountResponse(
                        account.getAccountID(),
                        account.getUsername(),
                        account.getEmail(),
                        account.getPhoneNumber(),
                        account.getAvatar(),
                        account.getCreatedAt(),
                        account.getIsActive(),
                        account.getGender(),
                        account.getBirthDate()))
                .collect(Collectors.toList());

        if (accountResponse.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(accountResponse);
    }

    @PatchMapping("/account/{id}/active")
    public ResponseEntity<String> updateAccountActiveStatus(@PathVariable String id, @RequestParam Boolean isActive) {
        try {
            accountService.updateAccountActiveStatus(id, isActive);
            return ResponseEntity.ok("Account active status updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update account active status: " + e.getMessage());
        }
    }

}
