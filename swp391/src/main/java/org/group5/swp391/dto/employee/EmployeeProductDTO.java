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
    EmployeeCategoryDTO employeeCategoryDTO;
    List<EmployeeZoneDTO> zonesetDTOList= new ArrayList<>();
    long quantity;
}
