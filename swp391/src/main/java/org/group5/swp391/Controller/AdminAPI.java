package org.group5.swp391.Controller;

import org.group5.swp391.DTO.Request.UpdateAccountActiveRequest;
import org.group5.swp391.DTO.Response.AccountResponse;
import org.group5.swp391.DTO.Response.UpdateAccountActiveResponse;
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

    @PatchMapping("/account_active")
    public ResponseEntity<UpdateAccountActiveResponse> updateAccountActiveStatus(
            @RequestBody UpdateAccountActiveRequest request) {
        try {
            // Gọi service để cập nhật trạng thái
            accountService.updateAccountActiveStatus(request.getId(), request.getIsActive());

            // Trả về phản hồi thành công
            UpdateAccountActiveResponse response = new UpdateAccountActiveResponse(
                    "Update status active for Account ID " + request.getId() + " successful."
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Trả về phản hồi lỗi
            UpdateAccountActiveResponse response = new UpdateAccountActiveResponse(
                    "Update status active failed: " + e.getMessage()
            );
            return ResponseEntity.badRequest().body(response);
        }
    }

}
