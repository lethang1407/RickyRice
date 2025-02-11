package org.group5.swp391.DTO.ProductDTOTool;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Getter
@Setter
public class CategoryDTO {
    String categoryID;
    String name;
    String description;
}
