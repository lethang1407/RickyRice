package org.group5.swp391.dto.debt;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DebtCreationRequest implements Serializable {
    @NotNull
    @Min(1)
    Double amount;

    @NotNull
    String type;

    @NotNull
    String customerId;

    @NotNull
    String storeId;

    String description;

    String image;
}
