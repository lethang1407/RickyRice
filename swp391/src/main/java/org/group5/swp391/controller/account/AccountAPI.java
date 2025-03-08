package org.group5.swp391.controller.account;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.request.account.UpdateAccountRequest;
import org.group5.swp391.dto.response.AdminResponse.AccountResponse;
import org.group5.swp391.dto.response.ApiResponse;
import org.group5.swp391.service.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
public class AccountAPI {

    private final AccountService accountService;

    @GetMapping("/infor")
    public ApiResponse<AccountResponse> getAccountInfo() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AccountResponse accountResponse = accountService.getAccountByUsername(username);
        return ApiResponse.<AccountResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Fetched account successfully")
                .data(accountResponse)
                .build();
    }

    @PatchMapping("/update")
    public ApiResponse<AccountResponse> updateAccountInfo(@RequestBody UpdateAccountRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AccountResponse accountResponse = accountService.updateAccountInfor(username, request);
        return ApiResponse.<AccountResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Fetched account successfully")
                .data(accountResponse)
                .build();
    }

}

