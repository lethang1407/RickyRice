package org.group5.swp391.Converter.ProductConverterTool;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.ProductDTOTool.CategoryDTO;
import org.group5.swp391.Entity.Category;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryConverter {
    private final ModelMapper modelMapper;

    public CategoryDTO toCategoryDTO(Category category) {
        return modelMapper.map(category, CategoryDTO.class);
    }
}
