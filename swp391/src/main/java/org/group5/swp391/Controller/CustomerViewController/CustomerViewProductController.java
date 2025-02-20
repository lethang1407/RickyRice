package org.group5.swp391.Controller.CustomerViewController;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.CustomerRequirementDTO.CustomerProductDTO;

import org.group5.swp391.Service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/store")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class CustomerViewProductController {
    private final ProductService productService;

    @GetMapping("/products")
    public Page<CustomerProductDTO> getAllProducts(@RequestParam( defaultValue = "") String query,
                                                   @RequestParam(defaultValue = "0") Double minPrice,
                                                   @RequestParam(defaultValue = "1000000") Double maxPrice,
                                                   @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "5") int size,
                                                   @RequestParam(defaultValue = "price") String sortBy,
                                                   @RequestParam(defaultValue = "false") boolean descending) {
        return productService.searchProductsQuery(query, minPrice, maxPrice, page, size, sortBy, descending);
    }
}