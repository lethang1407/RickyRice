package org.group5.swp391.DTO.Response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class AccountResponse {
    String accountID;
    String username;
    String name;
    String email;
    String phoneNumber;
    String avatar;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isActive;
    Boolean gender;
    LocalDate birthDate;

}
