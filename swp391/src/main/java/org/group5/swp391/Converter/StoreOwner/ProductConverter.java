package org.group5.swp391.Converter.StoreOwner;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.StoreOwnerDTO.ProductDTO;
import org.group5.swp391.Entity.Product;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component("storeProductConverter")
@RequiredArgsConstructor
public class ProductConverter {
    private final ModelMapper modelMapper;

    public ProductDTO toProductDTO(Product product){
        ProductDTO productDTO = modelMapper.map(product, ProductDTO.class);
        productDTO.setCategoryName(product.getCategory().getName());
        return productDTO;
    }
}