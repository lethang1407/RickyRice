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
//    @GetMapping("/categories/pagination")
//    public Page<EmployeeCategoryDTO> getAllCategories(@RequestParam("page") int page,
//                                                      @RequestParam("size") int size) {
//
//        return categoryService.getAllCategories(page,size,"categoryID",false);
//    }
//
//    @GetMapping("/category")
//    public Page<EmployeeProductDTO> getCategoryByName(@RequestParam("name")String name, @RequestParam("page") int page,
//                                                       @RequestParam("size") int size) {
//        return categoryService.getProductBySearch(name,page,size,"categoryID",false);
//    }
//
//    @GetMapping("/categories")
//    public List<EmployeeCategoryDTO> getAllCategoriesList() {
//        return categoryService.getAllCategories();
//    }
//
//    @GetMapping("/products-by-category")
//    public Page<EmployeeProductDTO> getProductByCateID(@RequestParam("categoryID")String categoryID, @RequestParam("page") int page,
//                                                       @RequestParam("size") int size) {
//       return productService.getProductsByCateID(categoryID,page,size,"price",false);
//    }
//    @GetMapping("/products-by-name")
//    public Page<EmployeeProductDTO> getProductByName(@RequestParam("name")String name, @RequestParam("categoryID")String categoryID, @RequestParam("page") int page,
//                                                     @RequestParam("size") int size) {
//        return productService.getProductBySearch(name,categoryID,page,size,"price",false);
//    }
    //CODE BỎ NHƯNG MÀ SỢ ANH ĐỨC TÔI MERGE LỖI XONG MẮNG OAN NÊN ĐÀNH COMMENT NHA MN
}
