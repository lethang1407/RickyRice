package org.group5.swp391.dto.employee;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
public class EmployeeCustomerDTO {
    String customerID;
    String name;
    String phoneNumber;
    String address;
    String email;
    Long created_at;
    Long updated_at;
    String created_by;
    EmployeeStoreDTO employeeStoreDTO;

    public EmployeeCustomerDTO(String customerID, String name, String phoneNumber) {
        this.customerID = customerID;
        this.name = name;
        this.phoneNumber = phoneNumber;
    }
}
