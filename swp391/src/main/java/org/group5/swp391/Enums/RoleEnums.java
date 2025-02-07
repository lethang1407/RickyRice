package org.group5.swp391.Enums;

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
