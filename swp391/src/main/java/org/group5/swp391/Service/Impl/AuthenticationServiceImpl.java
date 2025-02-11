package org.group5.swp391.Service.Impl;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.group5.swp391.Converter.AccountConverter;
import org.group5.swp391.DTO.Request.AuthenticationRequest.*;
import org.group5.swp391.DTO.Response.AuthenticationResponse.*;
import org.group5.swp391.Entity.Account;
import org.group5.swp391.Entity.InvalidatedToken;
import org.group5.swp391.Exception.AppException;
import org.group5.swp391.Exception.ErrorCode;
import org.group5.swp391.Utils.Jwt;
import org.group5.swp391.Repository.AccountRepository;
import org.group5.swp391.Repository.InvalidatedTokenRepository;
import org.group5.swp391.Service.AuthenticationService;
import org.group5.swp391.Utils.Mail;
import org.modelmapper.ModelMapper;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.text.ParseException;
import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final AccountRepository accountRepository;
    private final Jwt jwt;
    private final AccountConverter accountConverter;
    private final InvalidatedTokenRepository invalidatedTokenRepository;
    private final Mail mail;
    private final ModelMapper modelMapper;
    private final ThreadPoolTaskScheduler taskScheduler;

    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        Account account = accountRepository.findByUsername(authenticationRequest.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

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

    @Override
    public AccountCreationResponse createAccount(AccountCreationRequest request) {
        Account acc = accountConverter.toAccountEntity(request);

        if(accountRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
        if(accountRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        if(accountRepository.existsByPhoneNumber(acc.getPhoneNumber())) {
            throw new AppException(ErrorCode.PHONENUMBER_EXISTED);
        }

        Account a = accountRepository.save(acc);
        AccountCreationResponse res = modelMapper.map(a, AccountCreationResponse.class);
        return res;
    }

    @Override
    public void logout(LogoutRequest logoutRequest) {
        try{
            SignedJWT signedJWT = jwt.verifyToken(logoutRequest.getToken());
            InvalidatedToken token = new InvalidatedToken();
            token.setId(signedJWT.getJWTClaimsSet().getJWTID());
            token.setExpiryDate(signedJWT.getJWTClaimsSet().getExpirationTime());
            invalidatedTokenRepository.save(token);
        }catch (Exception e) {
            log.info(e.getMessage());
        }
    }

    @Override
    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        try{
            jwt.verifyToken(request.getToken());
        }catch(AppException e){
            return IntrospectResponse.builder()
                    .valid(false)
                    .build();
        }

        return IntrospectResponse.builder()
                .valid(true)
                .build();
    }

    @Override
    public boolean checkUsername(String username) {
        return accountRepository.existsByUsername(username);
    }

    @Override
    public EmailAndPhoneCheckResponse checkEmailAndPhone(EmalAndPhoneCheckRequest request) {
        boolean isEmailValid = !accountRepository.existsByEmail(request.getEmail());
        boolean isPhoneValid = !accountRepository.existsByPhoneNumber(request.getPhone());
        return EmailAndPhoneCheckResponse.builder()
                .isEmailValid(isEmailValid)
                .isPhoneValid(isPhoneValid)
                .build();
    }

    @Override
    public SendOTPResponse sendOTP(String key) {
        Boolean checkEmail = accountRepository.existsByEmail(key);
        Boolean checkUsername = accountRepository.existsByUsername(key);
        if(checkEmail || checkUsername) {
            String token = generate6DigitCode();
            Account acc = null;
            if(checkEmail) {
                acc = accountRepository.findByEmail(key)
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
                mail.sendEmail(key, token);
            }else if(checkUsername) {
                acc = accountRepository.findByUsername(key)
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
                mail.sendEmail(acc.getEmail(), token);
            }
            acc.setOtp(token);
            accountRepository.save(acc);

            scheduleTokenDeletion(acc.getAccountID());

            return SendOTPResponse.builder()
                    .email(acc.getEmail())
                    .username(acc.getUsername())
                    .isValid(true)
                    .build();
        }else {
            return SendOTPResponse.builder()
                    .isValid(false)
                    .build();
        }
    }

    @Override
    public boolean checkOTP(OTPCheckRequest request) {
        Account account = accountRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        if(account.getOtp().equals(request.getOTP())) {
            return true;
        }
        return false;
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {
        Account account = accountRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        if(account.getOtp().equals(request.getOTP())) {
            account.setPassword(request.getNewPassword());
        }else{
            throw new AppException(ErrorCode.OTP_INVALID);
        }
        account.setOtp(null);
        accountRepository.save(account);
    }

    private void scheduleTokenDeletion(String accountID) {
        taskScheduler.schedule(() -> {
            accountRepository.clearOTP(accountID);
        }, Instant.now().plusSeconds(300));
    }

    private String generate6DigitCode() {
        SecureRandom random = new SecureRandom();
        return String.format("%06d", random.nextInt(1000000));
    }
}
