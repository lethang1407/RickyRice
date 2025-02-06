package org.group5.swp391.DTO.Response.AuthenticationResponse;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class IntrospectResponse {
    private boolean valid;
}
