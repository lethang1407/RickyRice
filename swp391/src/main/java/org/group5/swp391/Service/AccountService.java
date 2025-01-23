package org.group5.swp391.Service;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.Request.UpdateAccountActiveRequest;
import org.group5.swp391.DTO.Response.AccountResponse;
import org.group5.swp391.DTO.Response.UpdateAccountActiveResponse;
import org.group5.swp391.Entity.Account;
import org.group5.swp391.Repository.AccountRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;

    // Trả về danh sách tài khoản theo role và chuyển đổi thành AccountResponse
    public List<AccountResponse> getAccountsByRole(String roleCode) {
        List<Account> accounts = accountRepository.findByRole_Code(roleCode);
        return accounts.stream()
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
    }

    // Cập nhật trạng thái Active cho tài khoản
    public UpdateAccountActiveResponse updateAccountActiveStatus(UpdateAccountActiveRequest request) {
        UpdateAccountActiveResponse response = new UpdateAccountActiveResponse();

        // Kiểm tra tính hợp lệ của ID và trạng thái
        if (request.getId() == null || request.getId().isEmpty()) {
            response.setMessage("Update status active failed: Account ID cannot be null or empty.");
            return response;
        }
        if (request.getIsActive() == null) {
            response.setMessage("Update status active failed: Active status cannot be null.");
            return response;
        }

        // Tìm kiếm tài khoản
        Account account = accountRepository.findById(request.getId())
                .orElse(null);

        if (account == null) {
            response.setMessage("Update status active failed: Account with ID " + request.getId() + " not found.");
            return response;
        }

        // Cập nhật trạng thái
        account.setIsActive(request.getIsActive());
        accountRepository.save(account);

        // Trả về phản hồi thành công
        response.setMessage("Update status active for Account ID " + request.getId() + " successful.");
        return response;
    }

}
