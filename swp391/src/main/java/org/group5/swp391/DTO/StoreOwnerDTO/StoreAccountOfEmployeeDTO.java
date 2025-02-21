package org.group5.swp391.DTO.StoreOwnerDTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreAccountOfEmployeeDTO {
    String accountID;
    String name;
    String email;
    String phoneNumber;
    String avatar;
    Boolean gender;
    LocalDate birthDate;
}