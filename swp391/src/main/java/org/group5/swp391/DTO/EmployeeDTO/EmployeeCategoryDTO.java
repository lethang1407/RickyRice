package org.group5.swp391.DTO.EmployeeDTO;


import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeCategoryDTO {

    String categoryID;
    String name;
    String description;
    long quantity;
}
