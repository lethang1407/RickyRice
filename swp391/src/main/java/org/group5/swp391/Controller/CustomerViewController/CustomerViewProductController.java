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
    public Page<CustomerProductDTO> getAllProducts(@Param("query") String query,
                                                   @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "10") int size) {
        if(query == null) return productService.getAllProducts();
        else {
            return productService.searchProducts(query, page, size);
        }
    }
}
