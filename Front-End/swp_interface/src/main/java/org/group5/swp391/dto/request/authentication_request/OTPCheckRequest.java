package org.group5.swp391.dto.request.authentication_request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class OTPCheckRequest {
    @NotNull
    private String OTP;
    @NotNull
    private String username;
}
