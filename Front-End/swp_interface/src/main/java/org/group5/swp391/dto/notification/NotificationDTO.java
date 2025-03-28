package org.group5.swp391.dto.notification;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationDTO {
    Long id;
    LocalDateTime createdAt;
    String message;
    boolean isRead;
    String senderName;
    String senderImage;
}
