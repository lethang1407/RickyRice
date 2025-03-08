package org.group5.swp391.dto.request.account;

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
    String name;
    String email;
    String phoneNumber;
    String avatar;
    Boolean gender;
    LocalDate birthDate;
}
