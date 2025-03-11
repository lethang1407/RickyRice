package org.group5.swp391.dto.request.account_request;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class UpdateAccountRequest {
    @NotBlank(message = "Name of account must not leave empty")
    String name;
    String phoneNumber;
    String avatar;
    Boolean gender;
    LocalDate birthDate;
}
