package org.group5.swp391.Converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.CustomerRequirementDTO.CustomerProductAttributeDTO;
import org.group5.swp391.Entity.ProductAttribute;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductAttributeConverter {
    private final ModelMapper modelMapper;

    public CustomerProductAttributeDTO toProductAttributeDTO(ProductAttribute productAttribute) {
        return modelMapper.map(productAttribute, CustomerProductAttributeDTO.class);
    }

}
