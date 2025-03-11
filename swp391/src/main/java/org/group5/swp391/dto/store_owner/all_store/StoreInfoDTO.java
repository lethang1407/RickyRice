package org.group5.swp391.dto.store_owner.all_store;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
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