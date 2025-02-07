package org.group5.swp391.DTO.Request.AuthenticationRequest;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ChangePasswordRequest {
    @NotNull
    private String otp;
    @NotNull
    private String key;
}
