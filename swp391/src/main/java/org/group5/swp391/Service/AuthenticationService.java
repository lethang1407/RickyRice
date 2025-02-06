package org.group5.swp391.Service;

import com.nimbusds.jose.JOSEException;
import org.group5.swp391.DTO.Request.AuthenticationRequest.*;
import org.group5.swp391.DTO.Response.AuthenticationResponse.AuthenticationResponse;
import org.group5.swp391.DTO.Response.AuthenticationResponse.EmailAndPhoneCheckResponse;
import org.group5.swp391.DTO.Response.AuthenticationResponse.IntrospectResponse;
import org.group5.swp391.DTO.Response.AuthenticationResponse.SendOTPResponse;
import org.springframework.stereotype.Service;

import java.text.ParseException;

@Service
public interface AuthenticationService {
    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest);
    public void createAccount(AccountCreationRequest request);
    public void logout(LogoutRequest logoutRequest);
    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException;
    public boolean checkUsername(String username);
    public EmailAndPhoneCheckResponse checkEmailAndPhone(EmalAndPhoneCheckRequest request);
    public SendOTPResponse sendOTP(String key);
    public boolean checkOTP(String otp);
}
