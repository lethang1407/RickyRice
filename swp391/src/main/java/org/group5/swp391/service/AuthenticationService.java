package org.group5.swp391.service;

import com.nimbusds.jose.JOSEException;
import org.group5.swp391.dto.request.authentication_request.*;
import org.group5.swp391.dto.response.AuthenticationResponse.*;
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
    public CheckOTPResponse checkOTP(OTPCheckRequest request);
    public void changePassword(ChangePasswordRequest request);
    public AuthenticationResponse outboundAuthenticate(String code);
    public AuthenticationResponse refresh(IntrospectRequest request);
}
