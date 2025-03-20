package org.group5.swp391.dto.debt;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.group5.swp391.utils.custom_constraint.PhoneConstraint;

@Getter
@AllArgsConstructor
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerCreationRequest {
    @NotNull
    String name;
    @PhoneConstraint
    String phoneNumber;
    String address;
    String email;
    @NotNull
    String storeId;
}
