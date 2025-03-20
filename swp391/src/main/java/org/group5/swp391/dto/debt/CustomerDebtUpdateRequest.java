package org.group5.swp391.dto.debt;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerDebtUpdateRequest {
    String name;
    String phoneNumber;
    String address;
    String email;
}
