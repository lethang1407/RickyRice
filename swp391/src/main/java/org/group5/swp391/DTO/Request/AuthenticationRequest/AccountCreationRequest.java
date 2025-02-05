package org.group5.swp391.DTO.Request.AuthenticationRequest;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountCreationRequest {
    @NotNull
    String username;

    @NotNull
    String password;

    @NotNull
    String name;

    @Email
    String email;

    @NotNull
    String phoneNumber;

    String avatar;

    LocalDate birthDate;

    Integer gender;

    @NotNull
    String role;
}
