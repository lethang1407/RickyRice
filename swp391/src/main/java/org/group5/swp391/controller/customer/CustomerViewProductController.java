package org.group5.swp391.controller.customer;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.customer_requirement.CustomerCategoryDTO;
import org.group5.swp391.dto.customer_requirement.CustomerProductDTO;

import org.group5.swp391.service.CategoryService;
import org.group5.swp391.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/store")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class CustomerViewProductController {
    private final ProductService productService;
    private final CategoryService categoryService;

    @GetMapping("/products")
    public Page<CustomerProductDTO> getProducts(@RequestParam(defaultValue = "") String query,
                                                @RequestParam(value="storeID", required = true) String storeID,
                                                @RequestParam(defaultValue = "0") Double minPrice,
                                                @RequestParam(defaultValue = "1000000") Double maxPrice,
                                                @RequestParam(value = "page", defaultValue = "0") int page,
                                                @RequestParam(value = "size", defaultValue = "5") int size,
                                                @RequestParam(defaultValue = "price") String sortBy,
                                                @RequestParam(defaultValue = "false") boolean descending,
                                                @RequestParam(defaultValue = "") String categoryID) {
        if (query == null || query.isEmpty()) {
            return productService.searchProductsQuery(query, storeID, minPrice, maxPrice, page, size, sortBy, descending, categoryID);
        }
        return productService.searchProductsQuery(query.trim(), storeID, minPrice, maxPrice, page, size, sortBy, descending, categoryID);
    }

    @GetMapping("/categories")
    public List<CustomerCategoryDTO> getAllCategories(@RequestParam(value = "storeID", required = true) String storeID) {
        return categoryService.getAllCustomerCategories(storeID);
    }
}