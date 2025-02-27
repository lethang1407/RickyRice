package org.group5.swp391.dto.store_owner;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreStatisticDTO {
    String statisticsID;
    String description;
    Boolean type;
    Double totalMoney;
    String storeID;
    String storeName;
    String createdBy;
    String createdAt;
}
