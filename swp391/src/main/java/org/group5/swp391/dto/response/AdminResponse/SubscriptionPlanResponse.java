package org.group5.swp391.dto.response.AdminResponse;

import lombok.*;
import lombok.experimental.FieldDefaults;
import jakarta.validation.constraints.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class SubscriptionPlanResponse {
    String subscriptionPlanID;
    String name;

    @NotBlank(message = "Description must not leave blank")
    String description;

    @Positive(message = "Price must be greater than 0")
    double price;

    @Min(value = 1, message = "The expiry date must be at least 1 day")
    Integer timeOfExpiration;
}
