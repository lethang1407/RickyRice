package org.group5.swp391.DTO.Request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubscriptionPlanRequest {
    String name;
    String description;
    double price;
    Integer timeOfExpiration;
}
