package org.group5.swp391.DTO.ProductDTOTool;


import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductDTO {

    String productID;
    String name;
    double price;
    String information;
    String productImage;
    CategoryDTO categoryDTO;
    List<ProductAttributeDTO> productAttributes = new ArrayList<>();
    List<ZoneDTO> zones = new ArrayList<>();

}
