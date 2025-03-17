package org.group5.swp391.dto.response.store_response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class StoreResponse {
    String storeID;
    String storeName;
    String address;
    String hotline;
    String description;
    String operatingHour;
    LocalDateTime expireAt;
    String image;
}
