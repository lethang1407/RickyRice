package org.group5.swp391.Service;

import com.nimbusds.jose.JOSEException;
import org.group5.swp391.DTO.Request.AuthenticationRequest.*;
import org.group5.swp391.DTO.Response.AuthenticationResponse.*;
import org.springframework.stereotype.Service;

import java.text.ParseException;

@Service
public interface AuthenticationService {
    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest);
    public AccountCreationResponse createAccount(AccountCreationRequest request);
    public void logout(LogoutRequest logoutRequest);
    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException;
    public boolean checkUsername(String username);
    public EmailAndPhoneCheckResponse checkEmailAndPhone(EmalAndPhoneCheckRequest request);
    public SendOTPResponse sendOTP(String key);
    public boolean checkOTP(OTPCheckRequest request);
    public void changePassword(ChangePasswordRequest request);
}
