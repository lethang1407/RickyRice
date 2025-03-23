package org.group5.swp391.controller.store_owner;




import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.store_owner.all_employee.StoreEmployeeDTO;
import org.group5.swp391.dto.store_owner.all_invoice.StoreInvoiceDTO;
import org.group5.swp391.dto.store_owner.all_invoice.StoreInvoiceDetailDTO;
import org.group5.swp391.dto.store_owner.all_product.*;
import org.group5.swp391.dto.store_owner.all_statistic.StoreStatisticDTO;
import org.group5.swp391.dto.store_owner.all_statistic.StoreStatisticDataDTO;
import org.group5.swp391.dto.store_owner.all_store.StoreInfoDTO;
import org.group5.swp391.exception.AppException;
import org.group5.swp391.exception.ErrorCode;
import org.group5.swp391.service.*;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;




import java.time.LocalDate;
import java.util.List;
import java.util.Map;




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
        try {
            return invoiceService.getInvoices(phoneNumber, page, size, sortBy, descending, type, status);
        } catch (Exception e) {
            throw new AppException(ErrorCode.CANT_GET_INFO);
        }
    }




    @GetMapping("/invoice-details")
    public List<StoreInvoiceDetailDTO> getInvoiceDetails(@RequestParam String invoiceId) {
        try {
            return invoiceDetailService.getInvoiceDetailsByInvoice(invoiceId);
        } catch (Exception e) {
            throw new AppException(ErrorCode.CANT_GET_INFO);
        }
    }




    @GetMapping("/stores")
    public Page<StoreInfoDTO> getStores(
            @RequestParam String storeName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "false") boolean descending
    ) {
        try {
            return storeService.getStores(storeName, page, size, sortBy, descending);
        } catch (Exception e) {
            throw new AppException(ErrorCode.CANT_GET_INFO);
        }
    }


    @GetMapping("/all/stores")
    public List<StoreInfoDTO> getAllStores() {
        try {
            return storeService.getStoresInfoIdAndName();
        } catch (Exception e) {
            throw new AppException(ErrorCode.CANT_GET_INFO);
        }
    }


    @GetMapping("/products")
    public Page<StoreProductDTO> getProducts(
            @RequestParam(required = false) String productID,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Double priceMin,
            @RequestParam(required = false) Double priceMax,
            @RequestParam(required = false) String categoryName,
            @RequestParam(required = false) List<String> store,
            @RequestParam(required = false) Integer quantityMin,
            @RequestParam(required = false) Integer quantityMax,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "false") boolean descending
    ) {
        try {
            return productService.getStoreProducts(productID, name, priceMin, priceMax, categoryName, store, quantityMin, quantityMax, page, size, sortBy, descending);
        } catch (Exception e) {
            throw new AppException(ErrorCode.CANT_GET_INFO);
        }
    }

    @GetMapping("/product-detail")
    public StoreProductDetailDTO getProduct(@RequestParam String id) {
        try {
            return productService.getStoreProduct(id);
        } catch (Exception e) {
            throw new AppException(ErrorCode.CANT_GET_INFO);
        }
    }




    @GetMapping("/all/category")
    public List<StoreCategoryIdAndNameDTO> getCategory() {
        try {
            return categoryService.getAllStoreCategories();
        } catch (Exception e) {
            throw new AppException(ErrorCode.CANT_GET_INFO);
        }
    }




    @GetMapping("/all/attribute")
    public List<StoreProductAttributeDTO> getAttribute() {
        try {
            return productAttributeService.getProductAttributes();
        } catch (Exception e) {
            throw new AppException(ErrorCode.CANT_GET_INFO);
        }
    }




    @PreAuthorize("@securityService.hasAccessToStore(#storeId)")
    @GetMapping("/store/zone")
    public List<StoreZoneIdAndNameDTO> getZonesForStore(@RequestParam String storeId) {
        try {
            return zoneService.getZoneIdAndNameForStore(storeId);
        } catch (Exception e) {
            throw new AppException(ErrorCode.CANT_GET_INFO);
        }
    }




    @PreAuthorize("@securityService.hasAccessToStore(#storeId)")
    @GetMapping("/store/empty-zone")
    public List<StoreZoneIdAndNameDTO> getEmptyZonesForStore(@RequestParam String storeId) {
        try {
            return zoneService.getEmptyZoneIdAndNameForStore(storeId);
        } catch (Exception e) {
            throw new AppException(ErrorCode.CANT_GET_INFO);
        }
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
            @RequestParam(defaultValue = "") String employeeID,
            @RequestParam(defaultValue = "") String name,
            @RequestParam(defaultValue = "") String email,
            @RequestParam(defaultValue = "") String phoneNumber,
            @RequestParam(defaultValue = "") List<String> store,
            @RequestParam(defaultValue = "all") String gender,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "employeeID") String sortBy,
            @RequestParam(defaultValue = "false") boolean descending
    ) {
        try {
            return employeeService.getEmployees(employeeID, name, email, phoneNumber, store, gender, page, size, sortBy, descending);
        } catch (Exception e) {
            throw new AppException(ErrorCode.CANT_GET_INFO);
        }
    }




    @GetMapping("/employee-detail")
    public StoreEmployeeDTO getEmployee(@RequestParam String id) {
        try {
            return employeeService.getEmployee(id);
        } catch (Exception e) {
            throw new AppException(ErrorCode.CANT_GET_INFO);
        }
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


    @GetMapping("/statistics/data")
    public Page<StoreStatisticDTO> getStatistics(
            @RequestParam(required = false) String storeName,
            @RequestParam(required = false) Double totalMoneyMin,
            @RequestParam(required = false) Double totalMoneyMax,
            @RequestParam(required = false) String description,
            @RequestParam(required = false, defaultValue = "all") String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdAtStart,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdAtEnd,
            @RequestParam(required = false) String createdBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "false") boolean descending
    ) {
        return statisticsService.getStatistics(storeName, totalMoneyMin, totalMoneyMax,
                description, type, createdAtStart, createdAtEnd, createdBy,
                page, size, sortBy, descending);


    }


    @GetMapping("/statistics/chart/by-description")
    public ResponseEntity<Map<String, Map<String, Double>>> getStatisticsByDescription(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) List<String> storeIds
    ) {
        Map<String, Map<String, Double>> data = statisticsService.getStatisticsByDescription(startDate, endDate, storeIds);
        return ResponseEntity.ok(data);
    }


    @GetMapping("/statistics/chart/by-type")
    public ResponseEntity<Map<String, Map<String, Double>>> getStatisticsByType(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) List<String> storeIds
    ) {
        Map<String, Map<String, Double>> data = statisticsService.getStatisticsByType(startDate, endDate, storeIds);
        return ResponseEntity.ok(data);
    }


    @GetMapping("/statistic-transactions")
    public StoreStatisticDataDTO getTransactionsByStores(@RequestParam List<String> storeIds) {
        try {
            return statisticsService.getStatisticTransactionsByStores(storeIds);
        } catch (Exception e) {
            throw new AppException(ErrorCode.CANT_GET_INFO);
        }
    }
}



