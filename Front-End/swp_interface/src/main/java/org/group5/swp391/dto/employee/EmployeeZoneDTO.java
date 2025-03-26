package org.group5.swp391.dto.employee;


import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeZoneDTO {

    String zoneID;
    String name;
    String location;
    LocalDateTime created_at;
      LocalDateTime updated_at;
      String created_by;
      EmployeeStoreDTO EmployeeStoreDTO;

}
