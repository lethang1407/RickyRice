package org.group5.swp391.DTO.EmployeeDTO;

import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

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
