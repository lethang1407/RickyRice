package org.group5.swp391.DTO.Request.AdminRequest;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubscriptionPlanRequest {
    @NotBlank(message = "Name of service package must not leave empty")
    String name;

    @NotBlank(message = "Description must not leave blank")
    String description;

    @Positive(message = "Price must be greater than 0")
    double price;

    @Min(value = 1, message = "The expiry date must be at least 1 day")
    Integer timeOfExpiration;
}
