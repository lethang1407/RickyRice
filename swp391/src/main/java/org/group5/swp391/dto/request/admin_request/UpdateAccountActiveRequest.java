package org.group5.swp391.dto.request.admin_request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateAccountActiveRequest {
    String id;
    Boolean isActive;
}
