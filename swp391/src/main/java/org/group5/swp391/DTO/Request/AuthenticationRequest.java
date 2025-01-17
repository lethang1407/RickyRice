package org.group5.swp391.DTO.Request;

import lombok.Data;

@Data
public class AuthenticationRequest {
    private String username;
    private String password;
}
