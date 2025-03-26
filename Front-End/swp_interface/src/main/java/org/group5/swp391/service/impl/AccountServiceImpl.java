package org.group5.swp391.service.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.request.account_request.ChangePasswordAccountRequest;
import org.group5.swp391.dto.request.account_request.UpdateAccountRequest;
import org.group5.swp391.dto.request.admin_request.UpdateAccountActiveRequest;
import org.group5.swp391.dto.response.account_response.AccountResponse;
import org.group5.swp391.entity.Account;
import org.group5.swp391.exception.AppException;
import org.group5.swp391.exception.ErrorCode;
import org.group5.swp391.repository.AccountRepository;
import org.group5.swp391.service.AccountService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;

    // lấy danh sách tài khoản theo role
    public List<AccountResponse> getAccountsByRole(String roleCode) {
        return accountRepository.findByRole_Code(roleCode).stream()
                .map(account -> AccountResponse.builder()
                        .accountID(account.getId())
                        .username(account.getUsername())
                        .name(account.getName())
                        .email(account.getEmail())
                        .phoneNumber(account.getPhoneNumber())
                        .avatar(account.getAvatar())
                        .createdAt(account.getCreatedAt())
                        .updatedAt(account.getUpdatedAt())
                        .isActive(account.getIsActive())
                        .gender(account.getGender())
                        .birthDate(account.getBirthDate())
                        .build())
                .collect(Collectors.toList());
    }

    // cập nhật trạng thái tài khoản
    public void updateAccountActiveStatus(UpdateAccountActiveRequest request) {
        if (request.getId() == null || request.getId().isEmpty()) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        if (request.getIsActive() == null) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }

        Account account = accountRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        account.setIsActive(request.getIsActive());
        accountRepository.save(account);
    }


    // lấy tài khoản theo ID
    public AccountResponse getAccountsByID(String accountID) {
        return accountRepository.findById(accountID)
                .map(account -> AccountResponse.builder()
                        .accountID(account.getId())
                        .username(account.getUsername())
                        .name(account.getName())
                        .email(account.getEmail())
                        .phoneNumber(account.getPhoneNumber())
                        .avatar(account.getAvatar())
                        .createdAt(account.getCreatedAt())
                        .updatedAt(account.getUpdatedAt())
                        .isActive(account.getIsActive())
                        .gender(account.getGender())
                        .birthDate(account.getBirthDate())
                        .build())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    public Optional<Account> getAccount(Account a) {
        return accountRepository.findByUsername(a.getUsername());
    }

    // lấy thông tin tài khoản theo tên đăng nhập
    public AccountResponse getAccountByUsername(String username) {
        return accountRepository.findByUsername(username)
                .map(account -> AccountResponse.builder()
                        .accountID(account.getId())
                        .username(account.getUsername())
                        .name(account.getName())
                        .email(account.getEmail())
                        .phoneNumber(account.getPhoneNumber())
                        .avatar(account.getAvatar())
                        .createdAt(account.getCreatedAt())
                        .updatedAt(account.getUpdatedAt())
                        .isActive(account.getIsActive())
                        .gender(account.getGender())
                        .birthDate(account.getBirthDate())
                        .build())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    // cập nhật thông tin tài khoản
    public AccountResponse updateAccountInfor(String username, UpdateAccountRequest request) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Not found username: " + username));

        if (request.getName() != null) account.setName(request.getName());
        if (request.getPhoneNumber() != null) account.setPhoneNumber(request.getPhoneNumber());
        if (request.getGender() != null) account.setGender(request.getGender());
        if (request.getBirthDate() != null) account.setBirthDate(request.getBirthDate());
        if (request.getAvatar() != null) account.setAvatar(request.getAvatar());

        Account updatedAccount = accountRepository.save(account);

        return AccountResponse.builder()
                .accountID(updatedAccount.getId())
                .username(updatedAccount.getUsername())
                .name(updatedAccount.getName())
                .email(updatedAccount.getEmail())
                .phoneNumber(updatedAccount.getPhoneNumber())
                .avatar(updatedAccount.getAvatar())
                .createdAt(updatedAccount.getCreatedAt())
                .updatedAt(updatedAccount.getUpdatedAt())
                .isActive(updatedAccount.getIsActive())
                .gender(updatedAccount.getGender())
                .birthDate(updatedAccount.getBirthDate())
                .build();
    }

    // lấy ID tài khoản theo tên đăng nhập
    public String getIDByUsername(String username) {
        Optional<Account> account = accountRepository.findByUsername(username);
        if (account.isPresent()) {
            return account.get().getId();
        }
        throw new AppException(ErrorCode.NOT_FOUND);
    }

    // thay đôi mật khẩu tài khoản
    public boolean changePassword(String username, ChangePasswordAccountRequest request) {
        Optional<Account> optionalAccount = accountRepository.findByUsername(username);
        if (optionalAccount.isPresent()) {
            Account account = optionalAccount.get();
            if (!request.getOldPassword().equals(account.getPassword())) {
                return false;
            }
            account.setPassword(request.getNewPassword());
            accountRepository.save(account);
            return true;
        }
        return false;
    }
}
