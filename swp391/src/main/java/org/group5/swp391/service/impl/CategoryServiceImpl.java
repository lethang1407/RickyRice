package org.group5.swp391.service.impl;


import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.ProductConverter;
import org.group5.swp391.dto.employee.EmployeeCategoryDTO;
import org.group5.swp391.dto.employee.EmployeeProductDTO;
import org.group5.swp391.entity.*;
import org.group5.swp391.repository.*;
import org.group5.swp391.service.CategoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository CategoryRepository;
    private final ZoneRepository zoneRepository;
    private final AccountRepository accountRepository;
    private final EmployeeRepository employeeRepository;
    private final ProductRepository productRepository;
    private final ProductConverter productConverter;

    public Long getTotalQuantityByCategoryId(String categoryId) {
        return zoneRepository.findTotalQuantityByCategoryId(categoryId);

    }

    public EmployeeCategoryDTO convertToCategoryDTO(Category category) {
        long quantity = 0;
        EmployeeCategoryDTO employeeCategoryDTO = new EmployeeCategoryDTO();

        employeeCategoryDTO.setCategoryID(category.getId());
        employeeCategoryDTO.setName(category.getName());
        employeeCategoryDTO.setDescription(category.getDescription());
        employeeCategoryDTO.setQuantity(getTotalQuantityByCategoryId(category.getId()));


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

    public Page<EmployeeProductDTO> getProductBySearch(String name, int page, int size, String sortBy, boolean descending){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Tài khoản không tồn tại"));
        Employee a=employeeRepository.findStoreIdByAccountEmpId(account.getAccountID());
        System.out.println(a.getStore().getStoreID());
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Category> categoryPage = CategoryRepository.findByNameIgnoreCase(name, pageable);
        Page<Product> productPage= productRepository.findByNameAndStoreIdContainingIgnoreCase(name,a.getStore().getStoreID(),pageable);
        return productPage.map(productConverter::toEmployeeProductDTO);
    }

}
