package org.group5.swp391.DTO.CustomerRequirementDTO;


import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerProductDTO {

    String productID;
    String name;
    double price;
    String information;
    String productImage;
    CustomerCategoryDTO customerCategoryDTO;
    List<CustomerProductAttributeDTO> productAttributes = new ArrayList<>();
    List<CustomerZoneDTO> zones = new ArrayList<>();

}
