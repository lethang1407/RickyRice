package org.group5.swp391.DTO.Request.AuthenticationRequest;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.group5.swp391.Utils.CustomConstraint.PhoneConstraint;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmalAndPhoneCheckRequest {
    @NotNull
    @Email
    String email;

    @NotNull
    @PhoneConstraint
    String phone;
}
