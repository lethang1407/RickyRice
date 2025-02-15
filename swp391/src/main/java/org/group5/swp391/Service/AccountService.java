package org.group5.swp391.Service;

import org.group5.swp391.DTO.Request.AdminRequest.UpdateAccountActiveRequest;
import org.group5.swp391.DTO.Response.AdminResponse.AccountResponse;
import org.group5.swp391.Entity.Account;
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
