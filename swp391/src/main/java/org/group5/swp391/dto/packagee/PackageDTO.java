package org.group5.swp391.dto.packagee;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PackageDTO {
    String id;
    String name;
    String description;
    Long quantity;
}
