package org.group5.swp391.dto.packagee;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Getter
@AllArgsConstructor
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PackageCreationRequest implements Serializable {
    @NotBlank
    String name;

    @NotNull
    Long quantity;

    String description;

    @NotBlank
    String storeId;
}
