package org.group5.swp391.Controller.OtherController;

import org.group5.swp391.DTO.ProductDTOTool.ProductDTO;

import org.group5.swp391.Service.Impl.OtherProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/store")
@CrossOrigin(origins = "http://localhost:3000")
public class OtherProductController {

    @Autowired
    private OtherProductService productService;

    @GetMapping("/products")
    public Page<ProductDTO> getAllProducts(@Param("query") String query,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "10") int size) {
        if(query == null) return productService.getAllProducts();
        else {
            return productService.searchProducts(query, page, size);
        }
    }

}
