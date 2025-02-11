package org.group5.swp391.DTO.Request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateAccountActiveRequest {
    String id;
    Boolean isActive;
}
