package org.group5.swp391.Controller.StoreOwnerController;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreInvoiceDTO;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreProductDTO;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreInfoDTO;
import org.group5.swp391.Service.InvoiceService;
import org.group5.swp391.Service.ProductService;
import org.group5.swp391.Service.StoreService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/store-owner")
@RequiredArgsConstructor
public class StoreOwnerController {
    private final InvoiceService invoiceService;
    private final StoreService storeService;
    private final ProductService productService;

    @GetMapping("/invoices")
    public Page<StoreInvoiceDTO> getInvoices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "false") boolean descending
    ) {
        return invoiceService.getInvoices(page, size, sortBy, descending);
    }

    @GetMapping("/search-invoices")
    public Page<StoreInvoiceDTO> searchInvoices(
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
    public Page<StoreInfoDTO> getStores(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "false") boolean descending
    ) {
        return storeService.getStores(page, size, sortBy, descending);
    }

    @GetMapping("/search-stores")
    public Page<StoreInfoDTO> searchStores(
            @RequestParam String storeName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "false") boolean descending
    ) {
        return storeService.searchStores(storeName,page, size, sortBy, descending);
    }

    @GetMapping("/products")
    public Page<StoreProductDTO> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "false") boolean descending
    ) {
        return productService.getProducts(page, size, sortBy, descending);
    }
    @GetMapping("/search-products")
    public Page<StoreProductDTO> searchProducts(
            @RequestParam String productName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "false") boolean descending
    ) {
        return productService.searchProducts(productName, page, size, sortBy, descending);
    }
}