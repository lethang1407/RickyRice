package org.group5.swp391.service;

import org.group5.swp391.dto.request.admin_request.UpdateAccountActiveRequest;
import org.group5.swp391.dto.response.AdminResponse.AccountResponse;
import org.group5.swp391.entity.Account;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface AccountService {
    public List<AccountResponse> getAccountsByRole(String roleCode);
    public void updateAccountActiveStatus(UpdateAccountActiveRequest request);
    public AccountResponse getAccountsByID(String accountID);
    public Optional<Account> getAccount(Account a);
}
