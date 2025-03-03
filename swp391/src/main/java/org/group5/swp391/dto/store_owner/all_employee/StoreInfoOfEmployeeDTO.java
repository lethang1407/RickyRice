package org.group5.swp391.dto.store_owner.all_employee;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreInfoOfEmployeeDTO {
    String storeName;
    String storeID;
}