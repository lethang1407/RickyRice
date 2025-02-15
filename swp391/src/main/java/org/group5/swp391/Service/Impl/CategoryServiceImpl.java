package org.group5.swp391.Service.Impl;


import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.EmployeeDTO.EmployeeCategoryDTO;
import org.group5.swp391.Entity.Category;
import org.group5.swp391.Repository.CategoryRepository;
import org.group5.swp391.Repository.ZoneRepository;
import org.group5.swp391.Service.CategoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository CategoryRepository;
    private final ZoneRepository zoneRepository;

    public Long getTotalQuantityByCategoryId(String categoryId) {
        return zoneRepository.findTotalQuantityByCategoryId(categoryId);

    }

    public EmployeeCategoryDTO convertToCategoryDTO(Category category) {
        long quantity = 0;
        EmployeeCategoryDTO employeeCategoryDTO = new EmployeeCategoryDTO();

        employeeCategoryDTO.setCategoryID(category.getCategoryID());
        employeeCategoryDTO.setName(category.getName());
        employeeCategoryDTO.setDescription(category.getDescription());
        employeeCategoryDTO.setQuantity(getTotalQuantityByCategoryId(category.getCategoryID()));


        return employeeCategoryDTO;
    }

    public List<EmployeeCategoryDTO> getAllCategories() {
        return CategoryRepository.findAll().stream()
                .map(this::convertToCategoryDTO)
                .collect(Collectors.toList());
    }
    public Page<EmployeeCategoryDTO> getAllCategories(int page, int size, String sortBy, boolean descending) {
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Category> categoryPage = CategoryRepository.findAll(pageable);
        return categoryPage.map(this::convertToCategoryDTO);
    }

    public Page<EmployeeCategoryDTO> getCategoryBySearch(String name, int page, int size, String sortBy, boolean descending){
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Category> categoryPage = CategoryRepository.findByNameIgnoreCase(name, pageable);
        return categoryPage.map(this::convertToCategoryDTO);
    }

}
