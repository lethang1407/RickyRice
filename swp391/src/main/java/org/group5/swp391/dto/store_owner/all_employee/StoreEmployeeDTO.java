package org.group5.swp391.dto.store_owner.all_employee;

import jakarta.validation.Valid;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreEmployeeDTO {
    String employeeID;
    @Valid
    StoreAccountOfEmployeeDTO storeAccount;
    StoreInfoOfEmployeeDTO storeInfo;
}