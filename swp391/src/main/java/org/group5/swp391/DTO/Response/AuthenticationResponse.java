package org.group5.swp391.DTO.Response;

import lombok.Data;

@Data
public class AuthenticationResponse {
    private String token;
    private boolean success;
}
