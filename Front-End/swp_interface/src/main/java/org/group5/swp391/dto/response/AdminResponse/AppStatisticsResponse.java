package org.group5.swp391.dto.response.AdminResponse;

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
    String subcriptionPlanName;
    double subcriptionPlanPrice; // vnp_Amount
    String subcriptionDescription; // vnp_OrderInfo
    Integer subcriptionTimeOfExpiration;
    LocalDateTime createdAt;
    String createdBy; // Owner store
    String transactionNo; // Mã giao dịch ghi nhận tại hệ thống VNPAY
}
