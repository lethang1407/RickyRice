package org.group5.swp391.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.Converter.ProductConverter;
import org.group5.swp391.DTO.CustomerRequirementDTO.CustomerProductDTO;
import org.group5.swp391.DTO.EmployeeDTO.EmployeeCategoryDTO;
import org.group5.swp391.DTO.EmployeeDTO.EmployeeProductDTO;
import org.group5.swp391.DTO.EmployeeDTO.EmployeeZoneDTO;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreProductDTO;
import org.group5.swp391.Entity.Product;
import org.group5.swp391.Entity.Zone;
import org.group5.swp391.Repository.ProductRepository;
import org.group5.swp391.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductConverter productConverter;

    // Chien
    @Override
    public Page<StoreProductDTO> getProducts(String productName, int page, int size, String sortBy, boolean descending) {
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        if(productName == null || productName.isEmpty()){
            productRepository.findAll(pageable).map(productConverter::toStoreProductDTO);
        }
        return productRepository.findByNameContainingIgnoreCase(productName, pageable).map(productConverter::toStoreProductDTO);
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


}