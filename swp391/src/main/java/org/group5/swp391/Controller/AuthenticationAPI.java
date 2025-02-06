package org.group5.swp391.Controller;

import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.Request.AuthenticationRequest.*;
import org.group5.swp391.DTO.Response.ApiResponse;
import org.group5.swp391.DTO.Response.AuthenticationResponse.AuthenticationResponse;
import org.group5.swp391.DTO.Response.AuthenticationResponse.EmailAndPhoneCheckResponse;
import org.group5.swp391.DTO.Response.AuthenticationResponse.IntrospectResponse;
import org.group5.swp391.DTO.Response.AuthenticationResponse.SendOTPResponse;
import org.group5.swp391.Service.AuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequiredArgsConstructor
public class AuthenticationAPI {
    private final AuthenticationService authenticationService;

    @PostMapping(value = "/login")
    public ApiResponse<AuthenticationResponse> login(@RequestBody @Valid AuthenticationRequest authenticationRequest) {
        AuthenticationResponse authenticationResponse = authenticationService.authenticate(authenticationRequest);
        return ApiResponse.<AuthenticationResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Login successfully")
                .data(authenticationResponse)
                .build();
    }

    @PostMapping(value = "/register")
    public ApiResponse<Void> register(@RequestBody @Valid AccountCreationRequest request) {
        authenticationService.createAccount(request);
        return ApiResponse.<Void>builder()
                .message("Created account successfully")
                .code(HttpStatus.CREATED.value())
                .build();
    }

    @PostMapping(value = "/logout")
    public ApiResponse<Void> logout(@RequestBody @Valid LogoutRequest logoutRequest) {
        authenticationService.logout(logoutRequest);
        return ApiResponse.<Void>builder()
                .message("Logout successfully")
                .code(HttpStatus.OK.value())
                .build();
    }

    @PostMapping(value = "/introspect")
    public ApiResponse<IntrospectResponse> introspect(@RequestBody @Valid IntrospectRequest request) throws ParseException, JOSEException {
        IntrospectResponse res = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder()
                .code(200)
                .message("Success")
                .data(res)
                .build();
    }

    @GetMapping(value = "/check-username/{username}")
    public ApiResponse<Boolean> checkUsername(@PathVariable String username) {
        boolean res = authenticationService.checkUsername(username);
        return ApiResponse.<Boolean>builder()
                .message("check successfully")
                .code(HttpStatus.OK.value())
                .data(res)
                .build();
    }

    @PostMapping(value = "check-email-phone")
    public ApiResponse<EmailAndPhoneCheckResponse> checkEmailPhone(@RequestBody @Valid EmalAndPhoneCheckRequest request){
        EmailAndPhoneCheckResponse response = authenticationService.checkEmailAndPhone(request);
        return ApiResponse.<EmailAndPhoneCheckResponse>builder()
                .message("check successfully")
                .code(HttpStatus.OK.value())
                .data(response)
                .build();
    }

    @GetMapping(value = "/send-otp/{key}")
    public ApiResponse<SendOTPResponse> sendOTP(@PathVariable String key) {
        SendOTPResponse res = authenticationService.sendOTP(key);
        return ApiResponse.<SendOTPResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Send otp successfully")
                .data(res)
                .build();
    }

    @GetMapping(value = "/change-password")
    public ApiResponse<String> changePassword(@RequestBody @Valid ChangePasswordRequest request) {

        return ApiResponse.<String>builder()
                .code(HttpStatus.OK.value())
                .build();
    }

}
