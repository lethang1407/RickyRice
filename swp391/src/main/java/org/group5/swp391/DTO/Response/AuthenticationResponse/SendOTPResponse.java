package org.group5.swp391.DTO.Response.AuthenticationResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class SendOTPResponse {
    private String username;
    private String email;
    private Boolean isValid;
}
