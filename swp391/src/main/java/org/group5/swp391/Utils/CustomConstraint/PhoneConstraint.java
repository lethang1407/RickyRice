package org.group5.swp391.Utils.CustomConstraint;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import org.group5.swp391.Utils.CustomValidator.PhoneValidator;

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
