package org.group5.swp391.controller.employee;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.group5.swp391.dto.employee.EmployeeCategoryDTO;
import org.group5.swp391.dto.employee.EmployeeProductDTO;
import org.group5.swp391.service.CategoryService;
import org.group5.swp391.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/employee")
@RequiredArgsConstructor
public class EmployeeCategoryController {
    private final ProductService productService;
    private final CategoryService categoryService;
}
