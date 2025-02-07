package org.group5.swp391.DTO.Response.AuthenticationResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountCreationResponse {
    private String accountID;
    private String username;
    private String email;
    private String phoneNumber;
}
