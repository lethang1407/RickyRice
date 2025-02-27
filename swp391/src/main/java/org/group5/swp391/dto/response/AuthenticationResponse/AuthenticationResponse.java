package org.group5.swp391.dto.response.AuthenticationResponse;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthenticationResponse {
    private String token;
    private boolean success;
}
