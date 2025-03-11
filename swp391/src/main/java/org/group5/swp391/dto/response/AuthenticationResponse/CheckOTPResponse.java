package org.group5.swp391.dto.response.AuthenticationResponse;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CheckOTPResponse {
    boolean isValid;
    int times;
}
