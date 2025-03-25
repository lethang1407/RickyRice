package org.group5.swp391.utils.custom_constraint;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import org.group5.swp391.utils.custom_validator.PhoneValidator;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PhoneValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface PhoneConstraint {
    String message() default "Invalid phone number";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
