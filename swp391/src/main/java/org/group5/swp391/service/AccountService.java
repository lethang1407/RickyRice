package org.group5.swp391.service;

import org.group5.swp391.dto.request.account_request.ChangePasswordAccountRequest;
import org.group5.swp391.dto.request.account_request.UpdateAccountRequest;
import org.group5.swp391.dto.request.admin_request.UpdateAccountActiveRequest;
import org.group5.swp391.dto.response.account_response.AccountResponse;
import org.group5.swp391.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface AccountService {
    public List<AccountResponse> getAccountsByRole(String roleCode);

    public void updateAccountActiveStatus(UpdateAccountActiveRequest request);

    public AccountResponse getAccountsByID(String accountID);

    public Optional<Account> getAccount(Account a);

    AccountResponse getAccountByUsername(String username);

    AccountResponse updateAccountInfor(String username, UpdateAccountRequest request);

    String getIDByUsername(String username);

    boolean changePassword(String username, ChangePasswordAccountRequest request);

    Page<AccountResponse> getStoreOwner(Boolean isActive, Boolean gender, String search, Pageable pageable);

    Long getTotalStoreOwners();
}
