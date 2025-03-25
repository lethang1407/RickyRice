package org.group5.swp391.dto.employee;


import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;


@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeProductDTO {
    String productID;
    String name;
    double price;
    String information;
    String productImage;
    long created_at;
    long updated_at;
    String created_by;
    List<EmployeeProductAttributeDTO> employeeProductAttributeDTO;
    long quantity;
    EmployeeCategoryDTO employeeCategoryDTO;
    List<EmployeeZoneDTO> zonesetDTOList = new ArrayList<>();
}
