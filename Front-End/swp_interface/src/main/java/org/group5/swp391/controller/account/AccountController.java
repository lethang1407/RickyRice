package org.group5.swp391.controller.account;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.request.account_request.ChangePasswordAccountRequest;
import org.group5.swp391.dto.request.account_request.UpdateAccountRequest;
import org.group5.swp391.dto.request.admin_request.MarkAsReadRequest;
import org.group5.swp391.dto.response.account_response.AccountResponse;
import org.group5.swp391.dto.response.account_response.NotificationResponse;
import org.group5.swp391.dto.response.ApiResponse;
import org.group5.swp391.service.AccountService;
import org.group5.swp391.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;
    private final NotificationService notificationService;

    // Lấy thông tin khách hàng
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

    // Cập nhật thông tin khách hàng
    @PatchMapping("/update")
    public ApiResponse<AccountResponse> updateAccountInfo(@RequestBody UpdateAccountRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AccountResponse accountResponse = accountService.updateAccountInfor(username, request);
        return ApiResponse.<AccountResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Update account successfully")
                .data(accountResponse)
                .build();
    }

    // Lấy thông báo của tài khoản
    @GetMapping("/notifications")
    public ApiResponse<List<NotificationResponse>> getNotifications() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String targetAccountId = accountService.getIDByUsername(username);
        List<NotificationResponse> notificationResponse = notificationService.getNotificationsByTargetAccountId(targetAccountId);
        return ApiResponse.<List<NotificationResponse>>builder()
                .code(notificationResponse.isEmpty() ? HttpStatus.NO_CONTENT.value() : HttpStatus.OK.value())
                .message(notificationResponse.isEmpty() ? "No store owners found" : "Fetched notifications successfully")
                .data(notificationResponse.isEmpty() ? null : notificationResponse)
                .build();
    }

    // Cập nhật trạng thái đã xem thông báo
    @PatchMapping("/notifications/mark-as-read")
    public ApiResponse<Void> markMultipleNotificationsAsRead(@RequestBody MarkAsReadRequest request) {
        notificationService.markMultipleAsRead(request);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Notifications marked as read successfully")
                .build();
    }

    // Đổi mật khẩu tài khoản
    @PostMapping("/change-password")
    public ApiResponse<String> changePassword(@RequestBody ChangePasswordAccountRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        boolean success = accountService.changePassword(username, request);
        if (success) {
            return ApiResponse.<String>builder()
                    .code(HttpStatus.OK.value())
                    .message("Password updated successfully")
                    .build();
        } else {
            return ApiResponse.<String>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("Password update failed. Incorrect old password.")
                    .build();
        }
    }


}

