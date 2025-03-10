package org.group5.swp391.converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.customer_requirement.CustomerProductAttributeDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreProductAttributeDTO;
import org.group5.swp391.entity.ProductAttribute;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductAttributeConverter {
    private final ModelMapper modelMapper;

    public CustomerProductAttributeDTO toProductAttributeDTO(ProductAttribute productAttribute) {
        CustomerProductAttributeDTO dto = modelMapper.map(productAttribute, CustomerProductAttributeDTO.class);
        dto.setProductAttributeID(productAttribute.getId());
        return dto;
    }

    public StoreProductAttributeDTO toStoreProductAttributeDTO(ProductAttribute productAttribute) {
        return modelMapper.map(productAttribute, StoreProductAttributeDTO.class);
    }

}
