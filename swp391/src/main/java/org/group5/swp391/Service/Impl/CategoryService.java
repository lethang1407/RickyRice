package org.group5.swp391.Service.Impl;


import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.EmployeeDTO.CategoryDTO;
import org.group5.swp391.Entity.Category;
import org.group5.swp391.Repository.CategoryRepository;
import org.group5.swp391.Repository.ZoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    private ZoneRepository zoneRepository;

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
    public Page<CategoryDTO> getAllCategories( int page, int size, String sortBy, boolean descending) {
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Category> categoryPage = CategoryRepository.findAll(pageable);
        return categoryPage.map(this::convertToCategoryDTO);
    }

    public Page<CategoryDTO> getCategoryBySearch(String name, int page, int size, String sortBy, boolean descending){
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Category> categoryPage = CategoryRepository.findByNameIgnoreCase(name, pageable);
        return categoryPage.map(this::convertToCategoryDTO);
    }


}
