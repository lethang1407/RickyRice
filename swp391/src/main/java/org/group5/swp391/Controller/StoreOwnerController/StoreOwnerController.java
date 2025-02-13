package org.group5.swp391.Controller.StoreOwnerController;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.StoreOwnerDTO.InvoiceDTO;
import org.group5.swp391.DTO.StoreOwnerDTO.ProductDTO;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreDTO;
import org.group5.swp391.Service.Impl.InvoiceServiceImpl;
import org.group5.swp391.Service.Impl.ProductServiceImpl;
import org.group5.swp391.Service.Impl.StoreServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/store-owner")
@RequiredArgsConstructor
public class StoreOwnerController {
    private final InvoiceServiceImpl invoiceService;
    private final StoreServiceImpl storeService;
    private final ProductServiceImpl productService;

    @GetMapping("/invoices")
    public Page<InvoiceDTO> getInvoices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "false") boolean descending
    ) {
        return invoiceService.getInvoices(page, size, sortBy, descending);
    }

    @GetMapping("/search-invoices")
    public Page<InvoiceDTO> searchInvoices(
            @RequestParam String phoneNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "false") boolean descending
    ) {
        System.out.println("mmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
        return invoiceService.searchInvoices(phoneNumber, page, size, sortBy, descending);
    }

    @GetMapping("/stores")
    public Page<StoreDTO> getStores(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "false") boolean descending
    ) {
        return storeService.getStores(page, size, sortBy, descending);
    }

    @GetMapping("/search-stores")
    public Page<StoreDTO> searchStores(
            @RequestParam String storeName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "false") boolean descending
    ) {
        return storeService.searchStores(storeName,page, size, sortBy, descending);
    }

    @GetMapping("/products")
    public Page<ProductDTO> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "false") boolean descending
    ) {
        return productService.getProducts(page, size, sortBy, descending);
    }
    @GetMapping("/search-products")
    public Page<ProductDTO> searchProducts(
            @RequestParam String productName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "false") boolean descending
    ) {
        return productService.searchProducts(productName, page, size, sortBy, descending);
    }
}