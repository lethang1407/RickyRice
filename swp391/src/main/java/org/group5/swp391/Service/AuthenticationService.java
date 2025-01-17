package org.group5.swp391.Service;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.Request.AuthenticationRequest;
import org.group5.swp391.DTO.Response.AuthenticationResponse;
import org.group5.swp391.Entity.Account;
import org.group5.swp391.JWTUtils.Jwt;
import org.group5.swp391.Repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private Jwt jwt;

    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        Account account = accountRepository.findByUsername(authenticationRequest.getUsername());
        AuthenticationResponse authenticationResponse = new AuthenticationResponse();
        if(account == null || !account.getPassword().equals(authenticationRequest.getPassword())) {
            authenticationResponse.setSuccess(false);
        }else{
            String token = jwt.generateToken(account);
            authenticationResponse.setToken(token);
            authenticationResponse.setSuccess(true);
        }
        return authenticationResponse;
    }
}
