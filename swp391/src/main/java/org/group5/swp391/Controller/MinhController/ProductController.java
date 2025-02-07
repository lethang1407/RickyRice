package org.group5.swp391.Controller.MinhController;


import lombok.Data;
import org.group5.swp391.DTO.MinhDTO.CategoryDTO;
import org.group5.swp391.DTO.MinhDTO.ProductDTO;
import org.group5.swp391.Entity.Product;
import org.group5.swp391.Service.MinhService.CategoryService;
import org.group5.swp391.Service.MinhService.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/home/owner")
@Data
public class ProductController {

    private final ProductService productService;
    private final CategoryService categoryService;



    @GetMapping("/products")
    public List<CategoryDTO> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/products/byCategory")
    public List<ProductDTO> getProductByCateID(@RequestParam("categoryID")String categoryID) {
       return productService.getProductByCateID(categoryID);
    }


}
