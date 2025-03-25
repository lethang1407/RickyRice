package org.group5.swp391.dto.store_owner.store_detail;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreDetailProductAttributeDTO {
    String id;
    String value;
    String storeID;
}