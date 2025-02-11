package org.group5.swp391.Converter.ProductConverterTool;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.ProductDTOTool.ProductAttributeDTO;
import org.group5.swp391.Entity.ProductAttribute;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductAttributeConverter {
    private final ModelMapper modelMapper;

    public ProductAttributeDTO toProductAttributeDTO(ProductAttribute productAttribute) {
        return modelMapper.map(productAttribute, ProductAttributeDTO.class);
    }

}
