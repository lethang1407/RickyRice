package org.group5.swp391.Controller.EmployeeController;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.group5.swp391.DTO.EmployeeDTO.EmployeeCategoryDTO;
import org.group5.swp391.DTO.EmployeeDTO.EmployeeProductDTO;
import org.group5.swp391.Service.CategoryService;
import org.group5.swp391.Service.ProductService;
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
public class EmployeeProductController {
    private final ProductService productService;
    private final CategoryService categoryService;

    @GetMapping("/categories/pagination")
    public Page<EmployeeCategoryDTO> getAllCategories(@RequestParam("page") int page,
                                                      @RequestParam("size") int size) {

        return categoryService.getAllCategories(page,size,"categoryID",false);
    }

    @GetMapping("/category")
    public Page<EmployeeCategoryDTO> getCategoryByName(@RequestParam("name")String name, @RequestParam("page") int page,
                                                       @RequestParam("size") int size) {

        return categoryService.getCategoryBySearch(name,page,size,"categoryID",false);
    }

    @GetMapping("/categories")
    public List<EmployeeCategoryDTO> getAllCategoriesList() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/products-by-category")
    public Page<EmployeeProductDTO> getProductByCateID(@RequestParam("categoryID")String categoryID, @RequestParam("page") int page,
                                                       @RequestParam("size") int size) {
       return productService.getProductsByCateID(categoryID,page,size,"price",false);
    }
    @GetMapping("/products-by-name")
    public Page<EmployeeProductDTO> getProductByName(@RequestParam("name")String name, @RequestParam("categoryID")String categoryID, @RequestParam("page") int page,
                                                     @RequestParam("size") int size) {
        return productService.getProductBySearch(name,categoryID,page,size,"price",false);
    }

}
