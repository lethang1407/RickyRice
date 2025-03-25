package org.group5.swp391.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum RoleEnums {
    ADMIN("ADMIN"), OWNER("STORE_OWNER"), EMPLOYEE("EMPLOYEE");
    private String value;
}
