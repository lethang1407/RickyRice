package org.group5.swp391.dto.response.AuthenticationResponse;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmailAndPhoneCheckResponse {
    private boolean isEmailValid;
    private boolean isPhoneValid;
}
