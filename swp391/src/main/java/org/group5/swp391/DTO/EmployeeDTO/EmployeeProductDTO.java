package org.group5.swp391.DTO.EmployeeDTO;


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
     EmployeeCategoryDTO employeeCategoryDTO;
   List<EmployeeZoneDTO> zonesetDTOList= new ArrayList<>();
   long quantity;

}
