package org.group5.swp391.service.impl;


import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.CategoryConverter;
import org.group5.swp391.dto.employee.EmployeeCategoryDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreCategoryIdAndNameDTO;
import org.group5.swp391.entity.Category;
import org.group5.swp391.repository.CategoryRepository;
import org.group5.swp391.repository.ZoneRepository;
import org.group5.swp391.service.CategoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository CategoryRepository;
    private final ZoneRepository zoneRepository;
    private final CategoryConverter categoryConverter;

    public EmployeeCategoryDTO convertToCategoryDTO(Category category) {
        long quantity = 0;
        EmployeeCategoryDTO employeeCategoryDTO = new EmployeeCategoryDTO();

        employeeCategoryDTO.setCategoryID(category.getId());
        employeeCategoryDTO.setName(category.getName());
        employeeCategoryDTO.setDescription(category.getDescription());


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

    public List<StoreCategoryIdAndNameDTO> getAllStoreCategories(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String username = authentication.getName();
        return CategoryRepository.findCategoriesForUser(username).stream().map(categoryConverter::toStoreCategoryIdAndName).collect(Collectors.toList());
    }
}
