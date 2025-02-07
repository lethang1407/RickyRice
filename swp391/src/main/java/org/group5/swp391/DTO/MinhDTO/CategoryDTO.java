package org.group5.swp391.DTO.MinhDTO;


import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryDTO {

    String categoryID;
    String name;
    String description;
    long quantity;
}
