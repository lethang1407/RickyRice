package org.group5.swp391.DTO.EmployeeDTO;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;


@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeStoreDTO {

    String storeID;
    String StoreName;
    String address;
    String hotline;
    String description;
    String operatingHour;
    LocalDateTime expireAt;
    String image;




}
