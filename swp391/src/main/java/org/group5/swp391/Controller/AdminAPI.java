package org.group5.swp391.Controller;

import org.group5.swp391.DTO.Request.UpdateAccountActiveRequest;
import org.group5.swp391.DTO.Response.AccountResponse;
import org.group5.swp391.DTO.Response.UpdateAccountActiveResponse;
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
        List<AccountResponse> accountResponses = accountService.getAccountsByRole("STORE_OWNER");
        if (accountResponses.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(accountResponses);
    }

    @PatchMapping(value = "/account_active")
    public UpdateAccountActiveResponse updateAccountActiveStatus(
            @RequestBody UpdateAccountActiveRequest request) {
        return accountService.updateAccountActiveStatus(request);
    }

}
