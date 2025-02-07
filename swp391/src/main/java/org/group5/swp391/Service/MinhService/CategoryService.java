package org.group5.swp391.Service.MinhService;


import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.MinhDTO.CategoryDTO;
import org.group5.swp391.Entity.Category;
import org.group5.swp391.Entity.Product;
import org.group5.swp391.Entity.Zone;
import org.group5.swp391.Repository.CategoryRepository;
import org.group5.swp391.Repository.MinhRepository.zoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    @Autowired
    private final CategoryRepository CategoryRepository;
    ;

    @Autowired
    private zoneRepository zoneRepository;

    public Long getTotalQuantityByCategoryId(String categoryId) {
        return zoneRepository.findTotalQuantityByCategoryId(categoryId);

    }

    public CategoryDTO convertToCategoryDTO(Category category) {
        long quantity = 0;
        CategoryDTO categoryDTO = new CategoryDTO();

        categoryDTO.setCategoryID(category.getCategoryID());
        categoryDTO.setName(category.getName());
        categoryDTO.setDescription(category.getDescription());
        categoryDTO.setQuantity(getTotalQuantityByCategoryId(category.getCategoryID()));


        return categoryDTO;
    }

    public List<CategoryDTO> getAllCategories() {
        return CategoryRepository.findAll().stream()
                .map(this::convertToCategoryDTO)
                .collect(Collectors.toList());
    }
}
