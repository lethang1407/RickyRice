package org.group5.swp391.Converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.CustomerRequirementDTO.CustomerCategoryDTO;
import org.group5.swp391.Entity.Category;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryConverter {
    private final ModelMapper modelMapper;

    public CustomerCategoryDTO toCategoryDTO(Category category) {
        return modelMapper.map(category, CustomerCategoryDTO.class);
    }
}
