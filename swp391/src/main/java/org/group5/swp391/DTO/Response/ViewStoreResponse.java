package org.group5.swp391.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ViewStoreResponse {
    String storeID;
    String storeName;
    String address;
    String hotline;
    String description;
    String operatingHour;
    LocalDateTime expireAt;
    String image;
    String accountName;
    String subscriptionPlanID;
    LocalDateTime createdAt;
    LocalDateTime updateAt;
    String subscriptionPlanName;
    double subscriptionPlanPrice;
    Integer subscriptionTimeOfExpiration;
}
