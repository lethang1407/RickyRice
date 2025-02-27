package org.group5.swp391.controller;

import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.request.authentication_request.*;
import org.group5.swp391.dto.response.ApiResponse;
import org.group5.swp391.dto.response.AuthenticationResponse.AuthenticationResponse;
import org.group5.swp391.dto.response.AuthenticationResponse.EmailAndPhoneCheckResponse;
import org.group5.swp391.dto.response.AuthenticationResponse.IntrospectResponse;
import org.group5.swp391.dto.response.AuthenticationResponse.SendOTPResponse;
import org.group5.swp391.service.AuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
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

    @PostMapping(value = "/check-otp")
    public ApiResponse<?> checkOTP(@RequestBody @Valid OTPCheckRequest request) {
        boolean res = authenticationService.checkOTP(request);
        return ApiResponse.builder()
                .code(HttpStatus.OK.value())
                .message("check successfully")
                .data(res)
                .build();
    }

    @PostMapping(value = "/change-password")
    public ApiResponse<String> changePassword(@RequestBody @Valid ChangePasswordRequest request) {
        authenticationService.changePassword(request);
        return ApiResponse.<String>builder()
                .code(HttpStatus.OK.value())
                .message("Change password successfully")
                .build();
    }

}
