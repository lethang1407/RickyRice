package org.group5.swp391.dto.notification;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SendNotificationRequest {
    String message;
    String type;
    String targetUsername;
}
