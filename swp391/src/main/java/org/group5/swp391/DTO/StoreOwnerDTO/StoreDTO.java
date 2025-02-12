package org.group5.swp391.DTO.StoreOwnerDTO;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoreDTO {
    private String storeID;
    private String storeName;
    private String address;
    private String hotline;
    private String description;
    private String operatingHour;
    private LocalDateTime expireAt;
}