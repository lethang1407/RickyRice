package org.group5.swp391.Controller.OtherController;

import org.group5.swp391.DTO.ProductDTOTool.ProductDTO;

import org.group5.swp391.Service.OtherProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/store")
@CrossOrigin(origins = "http://localhost:3000")
public class OtherProductController {

    @Autowired
    private OtherProductService productService;

    @GetMapping("/products")
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }

}
