package org.group5.swp391.dto.store_owner.all_store;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StoreInfoDTO {
    private String storeID;
    private String storeName;
    private String address;
    private String hotline;
    private String description;
    private String operatingHour;
    private LocalDateTime expireAt;
}