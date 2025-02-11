package org.group5.swp391.DTO.EmployeeDTO;


import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.group5.swp391.Entity.Store;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class zoneDTO {

    String zoneID;
    String name;
    String location;
    long quantity;
    long size;
      LocalDateTime created_at;
      LocalDateTime updated_at;
      String created_by;
      StoreDTO StoreDTO;

}
