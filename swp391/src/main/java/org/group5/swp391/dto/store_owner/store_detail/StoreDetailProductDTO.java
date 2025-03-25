package org.group5.swp391.dto.store_owner.store_detail;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreDetailProductDTO {
    String id;
    String name;
    double price;
    String information;
    Long quantity;
    String productImage;
    LocalDateTime createdAt;
    String createdBy;
    LocalDateTime updatedAt;
    String updatedBy;
    String categoryID;
    List<String> zoneList;
    List<String> productAttributeList;
    List<StoreDetailProductAttributeDTO> storeDetailProductAttributeDTOList;
    List<StoreDetailZoneDTO> storeDetailZoneDTOList;
}