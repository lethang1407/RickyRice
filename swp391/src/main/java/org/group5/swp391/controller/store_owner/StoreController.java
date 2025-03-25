package org.group5.swp391.controller.store_owner;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.store_owner.store_detail.StoreDetailCategoryDTO;
import org.group5.swp391.dto.store_owner.store_detail.StoreDetailProductAttributeDTO;
import org.group5.swp391.dto.store_owner.store_detail.StoreDetailZoneDTO;
import org.group5.swp391.dto.store_owner.store_detail.StoreDetailProductDTO;
import org.group5.swp391.exception.AppException;
import org.group5.swp391.service.CategoryService;
import org.group5.swp391.service.ProductAttributeService;
import org.group5.swp391.service.ProductService;
import org.group5.swp391.service.ZoneService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/store-detail")
@RequiredArgsConstructor
public class StoreController {

    private final ZoneService zoneService;
    private final ProductService productService;
    private final CategoryService categoryService;
    private final ProductAttributeService productAttributeService;

    @PreAuthorize("@securityService.hasAccessToStore(#storeID)")
    @GetMapping("/zones")
    public Page<StoreDetailZoneDTO> getStoreZones(@RequestParam(value = "zoneName", required = false) String zoneName,
                                                  @RequestParam(value = "storeID") String storeID,
                                                  @RequestParam(value = "page", defaultValue = "0") int page,
                                                  @RequestParam(value = "size", defaultValue = "10") int size,
                                                  @RequestParam(defaultValue = "createdAt") String sortBy,
                                                  @RequestParam(defaultValue = "false") boolean descending) throws Exception {
        if (zoneName == null || zoneName.isEmpty()) {
            return zoneService.getStoreZones(zoneName, storeID, page, size, sortBy, descending);
        }
        return zoneService.getStoreZones(zoneName.trim(), storeID, page, size, sortBy, descending);
    }

    @GetMapping("/get-zone")
    public StoreDetailZoneDTO getZoneById(@RequestParam(value = "zoneID") String zoneID) {
        return zoneService.getZone(zoneID);
    }

    @PostMapping("/zones")
    public ResponseEntity<String> addNewZone(@RequestBody StoreDetailZoneDTO storeZoneDTO) throws Exception {
        try {
            zoneService.addZone(storeZoneDTO);
            return ResponseEntity.ok("Thêm zone thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi không thêm được sản phẩm");
        }
    }

    @PutMapping("/zones/{zoneID}")
    public ResponseEntity<String> updateZone(@PathVariable String zoneID, @RequestBody StoreDetailZoneDTO updatedZone) {
        try {
            zoneService.updateZone(zoneID, updatedZone);
            return ResponseEntity.ok("Cập nhật zone thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Cập nhật zone không thành công");
        }
    }

    @DeleteMapping("/zones/{zoneID}")
    public ResponseEntity<String> deleteZone(@PathVariable String zoneID) {
        try {
            zoneService.deleteZone(zoneID);
            return ResponseEntity.ok("Xóa zone thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Xóa zone không thành công");
        }
    }

    @PreAuthorize("@securityService.hasAccessToStore(#storeID)")
    @GetMapping("/products")
    public Page<StoreDetailProductDTO> getProducts(@RequestParam(value = "search", required = false) String search,
                                                   @RequestParam(value = "storeID") String storeID,
                                                   @RequestParam(value = "page", defaultValue = "0") int page,
                                                   @RequestParam(value = "size", defaultValue = "10") int size,
                                                   @RequestParam(defaultValue = "createdAt") String sortBy,
                                                   @RequestParam(defaultValue = "false") boolean descending) throws Exception {
        if (search == null || search.isEmpty()) {
            return productService.getAllProductsByStoreID(search, storeID, page, size, sortBy, descending);
        }
        return productService.getAllProductsByStoreID(search.trim(), storeID, page, size, sortBy, descending);
    }

    @PreAuthorize("@securityService.hasAccessToStore(#storeID)")
    @PostMapping("/products")
    public ResponseEntity<String> createProduct(@RequestParam String storeID, @RequestBody StoreDetailProductDTO productDTO) throws Exception {
        try {
            productService.addProduct(storeID, productDTO);
            return ResponseEntity.ok("Thêm sản phẩm thành công");
        } catch (AppException appException) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(appException.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Thêm sản phẩm không thành công" + e.getMessage());
        }
    }

    @PutMapping("/products/{productID}&{storeID}")
    public ResponseEntity<String> updateProduct(@PathVariable String storeID, @PathVariable String productID, @RequestBody StoreDetailProductDTO updatedProduct) {
        try {
            productService.updateProduct(storeID, productID, updatedProduct);
            return ResponseEntity.ok("Cập nhật sản phẩm thành công");
        } catch (AppException appException) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(appException.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Cập nhật sản phẩm không thành công");
        }
    }

    @DeleteMapping("/products/{productID}")
    public ResponseEntity<String> deleteProduct(@PathVariable String productID) {
        try {
            productService.deleteProductStore(productID);
            return ResponseEntity.ok("Xóa sản phẩm thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Xóa sản phẩm không thành công");
        }
    }

    @GetMapping("category")
    public StoreDetailCategoryDTO getCategoryByID(@RequestParam(value = "categoryID") String categoryID) throws Exception {
        return categoryService.getCategoryByID(categoryID);
    }

    @PreAuthorize("@securityService.hasAccessToStore(#storeID)")
    @GetMapping("/all-categories")
    public List<StoreDetailCategoryDTO> getStoreCategory(@RequestParam(value = "storeID") String storeID) throws Exception {
        return categoryService.getStoreDetailAllCategoriesByStoreID(storeID);
    }

    @PreAuthorize("@securityService.hasAccessToStore(#storeID)")
    @GetMapping("/categories")
    public Page<StoreDetailCategoryDTO> getStoreCategories(@RequestParam(value = "search", required = false) String search,
                                                           @RequestParam(value = "storeID") String storeID,
                                                           @RequestParam(value = "page", defaultValue = "0") int page,
                                                           @RequestParam(value = "size", defaultValue = "10") int size,
                                                           @RequestParam(defaultValue = "createdAt") String sortBy,
                                                           @RequestParam(defaultValue = "false") boolean descending) throws Exception {
        if (search == null || search.isEmpty()) {
            return categoryService.getStoreDetailCategory(search, storeID, page, size, sortBy, descending);
        }
        return categoryService.getStoreDetailCategory(search.trim(), storeID, page, size, sortBy, descending);
    }

    @PostMapping("/categories")
    public ResponseEntity<String> createCategory(@RequestBody StoreDetailCategoryDTO storeDetailCategoryDTO) {
        try {
            categoryService.addCategory(storeDetailCategoryDTO);
            return ResponseEntity.ok("Thêm category thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Thêm category không thành công: " + e.getMessage());
        }
    }

    @PutMapping("/categories/{categoryID}")
    public ResponseEntity<String> updateCategory(@PathVariable String categoryID, @RequestBody StoreDetailCategoryDTO updatedCategory) {
        try {
            categoryService.updateCategory(categoryID, updatedCategory);
            return ResponseEntity.ok("Cập nhật category thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Cập nhât category không thành công");
        }
    }

    @DeleteMapping("/categories/{categoryID}")
    public ResponseEntity<String> deleteCategory(@PathVariable String categoryID) {
        try {
            categoryService.deleteCategory(categoryID);
            return ResponseEntity.ok("Xóa category thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Xóa category không thành công");
        }
    }

    @PreAuthorize("@securityService.hasAccessToStore(#storeID)")
    @GetMapping("/product-attributes")
    public Page<StoreDetailProductAttributeDTO> getProductAttributes(@RequestParam(value = "storeID") String storeID,
                                                                     @RequestParam(value = "page", defaultValue = "0") int page,
                                                                     @RequestParam(value = "size", defaultValue = "10") int size,
                                                                     @RequestParam(defaultValue = "value") String sortBy,
                                                                     @RequestParam(defaultValue = "false") boolean descending
    ) {
        return productAttributeService.getProductAttributeByStoreID(storeID, page, size, sortBy, descending);
    }

    @PostMapping("product-attributes")
    public ResponseEntity<String> createProductAttribute(@RequestBody StoreDetailProductAttributeDTO storeDetailProductAttributeDTO) {
        try {
            productAttributeService.addProductAttribute(storeDetailProductAttributeDTO);
            return ResponseEntity.ok("Thêm thuộc tính thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Thêm thuộc tính không thành công: " + e.getMessage());
        }
    }

    @PutMapping("product-attributes/{productAttributeID}")
    public ResponseEntity<String> updateProductAttribute(@PathVariable String productAttributeID, @RequestBody StoreDetailProductAttributeDTO updatedProductAttribute) {
        try {
            productAttributeService.updateProductAttribute(productAttributeID, updatedProductAttribute);
            return ResponseEntity.ok("Cập nhật thuộc tính thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Cập nhât thuộc tính không thành công");
        }
    }

    @DeleteMapping("/product-attributes/{productAttributeID}")
    public ResponseEntity<String> deleteProductAttribute(@PathVariable String productAttributeID) {
        try {
            productAttributeService.deleteProductAttribute(productAttributeID);
            return ResponseEntity.ok("Xóa product attribute thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Xóa product attribute không thành công");
        }
    }

}