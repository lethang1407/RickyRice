package org.group5.swp391.dto.store_owner.all_product;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreProductDetailDTO {
    String productID;
    String name;
    double price;
    String information;
    StoreCategoryIdAndNameDTO category;
    String productImage;
    StoreInfoIdAndNameDTO store;
    List<StoreProductAttributeDTO> attributes;
    Long quantity;
    List<StoreZoneIdAndNameDTO> zones;
}
