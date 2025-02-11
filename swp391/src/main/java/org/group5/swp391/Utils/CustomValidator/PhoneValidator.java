package org.group5.swp391.Utils.CustomValidator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.group5.swp391.Utils.CustomConstraint.PhoneConstraint;

public class PhoneValidator implements ConstraintValidator<PhoneConstraint, String> {
    @Override
    public void initialize(PhoneConstraint PhoneConstraint) {
        ConstraintValidator.super.initialize(PhoneConstraint);
    }

    @Override
    public boolean isValid(String phone, ConstraintValidatorContext constraintValidatorContext) {
        if(phone==null)
            return false;
        if(!phone.matches("^(03|05|07|08|09)\\d{8}$"))
            return false;
        return true;
    }
}

