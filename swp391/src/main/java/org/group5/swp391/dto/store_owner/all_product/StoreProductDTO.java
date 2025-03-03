package org.group5.swp391.dto.store_owner.all_product;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreProductDTO {
    String productID;
    String name;
    double price;
    String information;
    String categoryName;
}