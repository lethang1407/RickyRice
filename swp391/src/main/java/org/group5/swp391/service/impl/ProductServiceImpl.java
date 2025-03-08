package org.group5.swp391.service.impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.ProductConverter;
import org.group5.swp391.dto.customer_requirement.CustomerProductDTO;
import org.group5.swp391.dto.employee.EmployeeProductDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreProductDTO;
import org.group5.swp391.entity.Account;
import org.group5.swp391.entity.Product;
import org.group5.swp391.entity.Store;
import org.group5.swp391.repository.AccountRepository;
import org.group5.swp391.repository.ProductRepository;
import org.group5.swp391.repository.StoreRepository;
import org.group5.swp391.service.ProductService;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductConverter productConverter;
    private final AccountRepository accountRepository;
    private final StoreRepository storeRepository;

    // Chien
    @Override
    public Page<StoreProductDTO> getProducts(String productName, int page, int size, String sortBy, boolean descending) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username).orElseThrow(null);
        List<Store> stores = storeRepository.findByStoreAccount(account);
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        if(productName == null || productName.isEmpty()){
            productRepository.findAll(pageable).map(productConverter::toStoreProductDTO);
        }
        return productRepository.findByStoreInAndNameContainingIgnoreCase(stores, productName, pageable).map(productConverter::toStoreProductDTO);
    }


    // Minh Tran

    @Override
    public Page<EmployeeProductDTO> getProductsByCateID(String CateID, int page, int size, String sortBy, boolean descending) {
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> productPage = productRepository.findAllByCategoryId(pageable, CateID);
        return productPage.map(productConverter::toEmployeeProductDTO);
    }

    @Override
    public Page<EmployeeProductDTO>getProductBySearch(String name, String categoryID, int page, int size, String sortBy, boolean descending){
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> productPage = productRepository.findByNameIgnoreCase(name,categoryID, pageable);
        return productPage.map(productConverter::toEmployeeProductDTO);
    }


    // Hieu
    @Override
    public Page<CustomerProductDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        List<CustomerProductDTO> customerProductDTOS = products.stream().map(productConverter::toCustomerProductDTO).collect(Collectors.toList());

        return new PageImpl<>(customerProductDTOS);
    }

    @Override
    public Page<CustomerProductDTO> searchProducts(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.searchProducts(query, pageable);
        List<CustomerProductDTO> productPages = products.stream().map(productConverter::toCustomerProductDTO).collect(Collectors.toList());
        return new PageImpl<>(productPages, pageable, products.getTotalElements());
    }

    @Override
    public Page<CustomerProductDTO> searchProductsQuery(String querySearchName, Double minPrice, Double maxPrice, int page, int size, String sortBy, boolean descending) {
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        List<Product> products = productRepository.findByNameContainingAndPriceBetween(querySearchName, minPrice, maxPrice, pageable);
        List<CustomerProductDTO> productPages = products.stream().map(productConverter::toCustomerProductDTO).collect(Collectors.toList());
        return new PageImpl<>(productPages, pageable, (products.size() + 1));
    }


}