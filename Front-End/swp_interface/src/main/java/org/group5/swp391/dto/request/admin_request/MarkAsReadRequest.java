package org.group5.swp391.dto.request.admin_request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MarkAsReadRequest {
    List<String> notificationIDs;
    Boolean isRead;
}
