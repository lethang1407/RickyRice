package org.group5.swp391.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class AppStatisticsResponse {
    String appStatisticsID;
    String storeID;
    String storeName;
    String subcriptionPlanName;
    double subcriptionPlanPrice;
    String subcriptionDescription;
    Integer subcriptionTimeOfExpiration;
    private LocalDateTime createdAt;
    private String createdBy;

}
