package org.group5.swp391.dto.debt;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DebtCustomerDTO {
    String name;
    String phoneNumber;
    String address;
    String email;
    Double balance;
    String storeId;
    String customerId;
    String storeName;
    String createdBy;
    String createdAt;
    String updatedAt;
    String updatedBy;
}
