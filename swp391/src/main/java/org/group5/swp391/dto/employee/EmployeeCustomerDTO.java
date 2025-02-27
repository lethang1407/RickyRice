package org.group5.swp391.dto.employee;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeCustomerDTO {

    String customerID;
    String name;
    String phoneNumber;
    String address;
    String email;
    Long   created_at;
    Long  updated_at;
    String created_by;
    EmployeeStoreDTO employeeStoreDTO;


}
