package org.group5.swp391.dto.request.authentication_request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AuthenticationRequest {
    @NotNull
    private String username;
    @NotNull
    private String password;
}
