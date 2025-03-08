package org.group5.swp391.service.impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.request.account.UpdateAccountRequest;
import org.group5.swp391.dto.request.admin_request.UpdateAccountActiveRequest;
import org.group5.swp391.dto.response.AdminResponse.AccountResponse;
import org.group5.swp391.entity.Account;
import org.group5.swp391.exception.AppException;
import org.group5.swp391.exception.ErrorCode;
import org.group5.swp391.repository.AccountRepository;
import org.group5.swp391.service.AccountService;
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

    public AccountResponse updateAccountInfor(String username, UpdateAccountRequest request) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Not found username: " + username));
        account.setName(request.getName());
        account.setEmail(request.getEmail());
        account.setPhoneNumber(request.getPhoneNumber());
        account.setAvatar(request.getAvatar());
        account.setGender(request.getGender());
        account.setBirthDate(request.getBirthDate());

        Account updatedAccount = accountRepository.save(account);
        return AccountResponse.builder()
                .accountID(account.getId())
                .username(account.getUsername())
                .name(updatedAccount.getName())
                .email(updatedAccount.getEmail())
                .phoneNumber(updatedAccount.getPhoneNumber())
                .avatar(updatedAccount.getAvatar())
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .isActive(account.getIsActive())
                .gender(updatedAccount.getGender())
                .birthDate(account.getBirthDate())
                .build();
    }
}
