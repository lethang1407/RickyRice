package org.group5.swp391.dto.response.account_response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class NotificationResponse {
    String notificationId;
    String message;
    Boolean isRead;
    LocalDateTime createdAt;
    String createdBy;
    String accountId;
    String targetAccountId;
}
