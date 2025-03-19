package org.group5.swp391.dto.request.store_request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreRequest {
    @NotBlank(message = "Name of store must not leave empty")
    String storeName;
    @NotBlank(message = "Address of store must not leave empty")
    String address;
    @NotBlank(message = "Hotline of store must not leave empty")
    String hotline;
    @NotBlank(message = "Description of store must not leave empty")
    String description;
    @NotBlank(message = "Operating hour of store must not leave empty")
    String operatingHour;
    @NotBlank(message = "Image of store must not leave empty")
    String image;
}
