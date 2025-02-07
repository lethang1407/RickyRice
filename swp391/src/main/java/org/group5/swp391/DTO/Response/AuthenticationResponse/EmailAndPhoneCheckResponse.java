package org.group5.swp391.DTO.Response.AuthenticationResponse;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmailAndPhoneCheckResponse {
    private boolean isEmailValid;
    private boolean isPhoneValid;
}
