package org.group5.swp391.converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.customer_requirement.CustomerCategoryDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreCategoryIdAndNameDTO;
import org.group5.swp391.dto.store_owner.store_detail.StoreDetailCategoryDTO;
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

    public StoreCategoryIdAndNameDTO toStoreCategoryIdAndName(Category category) {
        StoreCategoryIdAndNameDTO dto =  modelMapper.map(category, StoreCategoryIdAndNameDTO.class);
        dto.setId(category.getId());
        return dto;
    }

    public StoreDetailCategoryDTO toStoreDetailCategoryDTO(Category category) {
        StoreDetailCategoryDTO dto =  modelMapper.map(category, StoreDetailCategoryDTO.class);
        dto.setStoreID(category.getStore().getId());
        return dto;
    }
}
