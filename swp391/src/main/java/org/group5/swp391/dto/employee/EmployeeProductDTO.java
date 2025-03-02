package org.group5.swp391.dto.employee;


import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;


@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeProductDTO {
    private  String productID;
    private  String name;
    private double price;
    private String information;
    private String productImage;
    private long created_at;
    private long updated_at;
    private String created_by;
     EmployeeCategoryDTO employeeCategoryDTO;
   List<EmployeeZoneDTO> zonesetDTOList= new ArrayList<>();
   long quantity;

}
