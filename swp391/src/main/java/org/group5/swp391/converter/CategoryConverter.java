package org.group5.swp391.converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.customer_requirement.CustomerCategoryDTO;
import org.group5.swp391.entity.Category;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryConverter {
    private final ModelMapper modelMapper;

    public CustomerCategoryDTO toCategoryDTO(Category category) {
        CustomerCategoryDTO dto =  modelMapper.map(category, CustomerCategoryDTO.class);
        dto.setCategoryID(category.getId());
        return dto;
    }
}
