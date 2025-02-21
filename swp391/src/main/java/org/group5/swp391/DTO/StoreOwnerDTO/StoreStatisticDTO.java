package org.group5.swp391.DTO.StoreOwnerDTO;
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
