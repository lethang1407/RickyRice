package org.group5.swp391.Service;

import org.group5.swp391.DTO.EmployeeDTO.EmployeeCategoryDTO;
import org.group5.swp391.Entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CategoryService {
    public Long getTotalQuantityByCategoryId(String categoryId);
    public EmployeeCategoryDTO convertToCategoryDTO(Category category);
    public List<EmployeeCategoryDTO> getAllCategories();
    public Page<EmployeeCategoryDTO> getAllCategories(int page, int size, String sortBy, boolean descending);
    public Page<EmployeeCategoryDTO> getCategoryBySearch(String name, int page, int size, String sortBy, boolean descending);
}
