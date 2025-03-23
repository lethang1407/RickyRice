package org.group5.swp391.dto.customer_requirement;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Getter
@Setter
public class CustomerCategoryDTO {
    String categoryID;
    String name;
    String description;
}
