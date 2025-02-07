package org.group5.swp391.DTO.Request.AuthenticationRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class OTPCheckRequest {
    private String OTP;
    private String username;
}
