package org.group5.swp391.DTO.MinhDTO;


import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;


@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductDTO {

    private  String productID;
    private  String name;
    private double price;
    private String information;
    private String productImage;
     CategoryDTO categoryDTO;
   List<zoneDTO> zonesetDTOList= new ArrayList<>();
   long quantity;

}
