package org.group5.swp391.controller.store_owner;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.ZoneConverter;
import org.group5.swp391.dto.store_owner.all_employee.StoreEmployeeDTO;
import org.group5.swp391.dto.store_owner.all_invoice.StoreInvoiceDTO;
import org.group5.swp391.dto.store_owner.all_invoice.StoreInvoiceDetailDTO;
import org.group5.swp391.dto.store_owner.all_product.*;
import org.group5.swp391.dto.store_owner.all_statistic.StoreStatisticDTO;
import org.group5.swp391.dto.store_owner.all_store.StoreInfoDTO;
import org.group5.swp391.service.*;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;


@RestController
@RequestMapping("/store-owner")
@RequiredArgsConstructor
public class StoreOwnerController {
    private final InvoiceService invoiceService;
    private final StoreService storeService;
    private final ProductService productService;
    private final InvoiceDetailService invoiceDetailService;
    private final EmployeeService employeeService;
    private final StatisticsService statisticsService;
    private final CategoryService categoryService;
    private final ProductAttributeService productAttributeService;
    private final ZoneService zoneService;


    @GetMapping("/invoices")
    public Page<StoreInvoiceDTO> getInvoices(
            @RequestParam String phoneNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "false") boolean descending,
            @RequestParam(defaultValue = "false") String type,
            @RequestParam(defaultValue = "false") String status
    ) {
        return invoiceService.getInvoices(phoneNumber, page, size, sortBy, descending, type, status);
    }


    @GetMapping("/invoice-details")
    public List<StoreInvoiceDetailDTO> getInvoiceDetails(@RequestParam String invoiceId) {
        return invoiceDetailService.getInvoiceDetailsByInvoice(invoiceId);
    }


    @GetMapping("/stores")
    public Page<StoreInfoDTO> getStores(
            @RequestParam String storeName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "false") boolean descending
    ) {
        return storeService.getStores(storeName, page, size, sortBy, descending);
    }


    @GetMapping("/products")
    public Page<StoreProductDTO> getProducts(
            @RequestParam String productName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "false") boolean descending
    ) {
        return productService.getProducts(productName, page, size, sortBy, descending);
    }


    @GetMapping("/product-detail")
    public StoreProductDetailDTO getProduct(@RequestParam String id) {
        return productService.getProduct(id);
    }


    @GetMapping("/all/category")
    public List<StoreCategoryIdAndNameDTO> getCategory() {
        return categoryService.getAllStoreCategories();
    }


    @GetMapping("/all/attribute")
    public List<StoreProductAttributeDTO> getAttribute() {
        return productAttributeService.getProductAttributes();
    }


    @PreAuthorize("@securityService.hasAccessToStore(#storeId)")
    @GetMapping("/store/zone")
    public List<StoreZoneIdAndNameDTO> getZonesForStore(@RequestParam String storeId) {
        return zoneService.getZoneIdAndNameForStore(storeId);
    }


    @PreAuthorize("@securityService.hasAccessToStore(#storeId)")
    @GetMapping("/store/empty-zone")
    public List<StoreZoneIdAndNameDTO> getEmptyZonesForStore(@RequestParam String storeId) {
        return zoneService.getEmptyZoneIdAndNameForStore(storeId);
    }



    @PutMapping(value = "/product/update/{id}")
    public ResponseEntity<String> updateProduct(
            @PathVariable String id,
            @RequestBody StoreProductDetailDTO product) {
        try {
            if (!id.equals(product.getProductID())) {
                return ResponseEntity.badRequest().body("Cập nhật sản phẩm thất bại");
            }
            productService.updateStoreProduct(id, product);
            return ResponseEntity.ok("Cập nhật sản phẩm thành công");


        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Cập nhật sản phẩm thất bại");
        }
    }


    @PutMapping(value = "/product/upload-image/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadProductImage(
            @PathVariable String productId,
            @RequestPart("file") MultipartFile file
    ) {
        String url = productService.updateStoreProductImage(productId, file);
        return ResponseEntity.ok(url);
    }


    @DeleteMapping("/product/delete/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") String productId) {
        try {
            productService.deleteProduct(productId);
            return ResponseEntity.ok("Xóa sản phẩm thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Xóa sản phẩm thất bại");
        }
    }


    @GetMapping("/employees")
    public Page<StoreEmployeeDTO> getEmployees(
            @RequestParam(defaultValue = "") String employeeName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "employeeID") String sortBy,
            @RequestParam(defaultValue = "false") boolean descending,
            @RequestParam(defaultValue = "all") String gender
    ) {
        return employeeService.getEmployees(employeeName, page, size, sortBy, descending, gender);
    }


    @GetMapping("/employee-detail")
    public StoreEmployeeDTO getEmployee(@RequestParam String id) {
        return employeeService.getEmployee(id);
    }


    @PutMapping(value = "/employee/upload-image/{employeeId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadEmployeeImage(
            @PathVariable String employeeId,
            @RequestPart("file") MultipartFile file
    ) {
        String url = employeeService.updateStoreEmployeeImage(employeeId, file);
        return ResponseEntity.ok(url);
    }


    @DeleteMapping("/employee/delete/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable("id") String employeeId) {
        try {
            employeeService.deleteEmployee(employeeId);
            return ResponseEntity.ok("Xóa sản phẩm thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Xóa sản phẩm thất bại");
        }
    }


    @PutMapping(value = "/employee/update/{id}")
    public ResponseEntity<String> updateEmployee(
            @PathVariable String id,
            @RequestBody StoreEmployeeDTO employee) {
        employeeService.updateStoreEmployee(id, employee);
        return ResponseEntity.ok("Cập nhật sản phẩm thành công");
    }


    @GetMapping("/statistics")
    public Page<StoreStatisticDTO> getStatistics(
            @RequestParam String storeName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "false") boolean descending
    ) {
        return statisticsService.getStatistics(storeName, page, size, sortBy, descending);
    }
}

