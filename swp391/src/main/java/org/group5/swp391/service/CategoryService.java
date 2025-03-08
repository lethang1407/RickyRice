package org.group5.swp391.service;

import org.group5.swp391.dto.employee.EmployeeCategoryDTO;
import org.group5.swp391.dto.employee.EmployeeProductDTO;
import org.group5.swp391.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CategoryService {
    public EmployeeCategoryDTO convertToCategoryDTO(Category category);
    public List<EmployeeCategoryDTO> getAllCategories();
    public Page<EmployeeCategoryDTO> getAllCategories(int page, int size, String sortBy, boolean descending);
    public Page<EmployeeProductDTO> getProductBySearch(String name, int page, int size, String sortBy, boolean descending);
}
