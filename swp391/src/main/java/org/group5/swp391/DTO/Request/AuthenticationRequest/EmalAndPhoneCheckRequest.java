package org.group5.swp391.DTO.Request.AuthenticationRequest;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmalAndPhoneCheckRequest {
    @NotNull
    String email;

    @NotNull
    String phone;
}
