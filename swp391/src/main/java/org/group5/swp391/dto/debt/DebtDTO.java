package org.group5.swp391.dto.debt;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.group5.swp391.enums.DebtType;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DebtDTO {
    String number;
    String description;
    DebtType type;
    LocalDateTime createdAt;
    Double amount;
    String image;
    String customerId;
    String customerName;
    String storeId;
    String storeName;
    String createdBy;
}
