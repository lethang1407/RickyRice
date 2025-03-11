package org.group5.swp391.service.impl;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.ProductConverter;
import org.group5.swp391.dto.customer_requirement.CustomerProductDTO;
import org.group5.swp391.dto.employee.EmployeeProductDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreProductAttributeDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreProductDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreProductDetailDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreZoneIdAndNameDTO;
import org.group5.swp391.entity.*;
import org.group5.swp391.exception.AppException;
import org.group5.swp391.exception.ErrorCode;
import org.group5.swp391.repository.*;
import org.group5.swp391.service.ProductService;
import org.group5.swp391.utils.CloudinaryService;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductConverter productConverter;
    private final AccountRepository accountRepository;
    private final StoreRepository storeRepository;
    private final CategoryRepository categoryRepository;
    private final ProductAttributeRepository productAttributeRepository;
    private final CloudinaryService cloudinaryService;
    private final ZoneRepository zoneRepository;

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

    private Product checkProductOfUser(String productID) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        String username = authentication.getName();
        return productRepository.findProductForUser(username, productID)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
    }

    public StoreProductDetailDTO getProduct(String id) {
        Product product = checkProductOfUser(id);
        return productConverter.toStoreProductDetailDTO(product);
    }

    @Transactional
    public StoreProductDetailDTO updateStoreProduct(String productID, StoreProductDetailDTO dto) {
        Product product = checkProductOfUser(productID);
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setInformation(dto.getInformation());
        product.setQuantity(dto.getQuantity());
        product.setProductImage(dto.getProductImage());
        Category category = categoryRepository.findById(dto.getCategory().getId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với ID: " + dto.getCategory().getId()));
        product.setCategory(category);
        List<ProductAttribute> attributes = productAttributeRepository.findAllById(
                dto.getAttributes().stream()
                        .map(StoreProductAttributeDTO::getId)
                        .toList()
        );
        product.setProductAttributes(attributes);
        List<Zone> oldZones = new ArrayList<>(product.getZones());
        product.getZones().clear();
        for (StoreZoneIdAndNameDTO zoneDto : dto.getZones()) {
            Zone zone;
            if (zoneDto.getId() != null) {
                zone = zoneRepository.findById(zoneDto.getId()).orElse(new Zone());
            } else {
                zone = new Zone();
            }
            zone.setName(zoneDto.getName());
            zone.setProduct(product);
            product.getZones().add(zone);
        }
        for (Zone oldZone : oldZones) {
            if (!product.getZones().contains(oldZone)) {
                oldZone.setProduct(null);
                zoneRepository.save(oldZone);
            }
        }
        productRepository.save(product);
        return productConverter.toStoreProductDetailDTO(product);
    }

    @Transactional
    public String updateStoreProductImage(String productID, MultipartFile file) {
        try {
            checkProductOfUser(productID);
            return cloudinaryService.uploadFile(file);
        } catch (IOException e) {
            throw new RuntimeException("Không thể tải ảnh lên!");
        }
    }

    @Transactional
    public void deleteProduct(String productId) {
        Product product = checkProductOfUser(productId);
        productRepository.delete(product);
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