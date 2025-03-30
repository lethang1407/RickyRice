package org.group5.swp391.service.impl;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.ProductConverter;
import org.group5.swp391.dto.customer_requirement.CustomerProductDTO;
import org.group5.swp391.dto.employee.EmployeeProductDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreProductAttributeDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreProductDTO;
import org.group5.swp391.dto.store_owner.store_detail.StoreDetailProductDTO;
import org.group5.swp391.entity.Account;
import org.group5.swp391.entity.Employee;
import org.group5.swp391.entity.Product;
import org.group5.swp391.entity.Store;
import org.group5.swp391.repository.AccountRepository;
import org.group5.swp391.repository.EmployeeRepository;
import org.group5.swp391.repository.ProductRepository;
import org.group5.swp391.repository.StoreRepository;
import org.group5.swp391.dto.store_owner.all_product.StoreProductDetailDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreZoneIdAndNameDTO;
import org.group5.swp391.entity.*;
import org.group5.swp391.exception.AppException;
import org.group5.swp391.exception.ErrorCode;
import org.group5.swp391.repository.*;
import org.group5.swp391.service.ProductService;
import org.group5.swp391.utils.CloudinaryService;
import org.springframework.data.domain.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductConverter productConverter;
    private final AccountRepository accountRepository;
    private final StoreRepository storeRepository;
    private final EmployeeRepository employeeRepository;
    private final CategoryRepository categoryRepository;
    private final ProductAttributeRepository productAttributeRepository;
    private final CloudinaryService cloudinaryService;
    private final ZoneRepository zoneRepository;

    // Chien
    private Product checkProductOfUser(String productID) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        String username = authentication.getName();
        return productRepository.findProductForUser(username, productID)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
    }

    @Override
    public Page<StoreProductDTO> getStoreProducts(String productID, String productName, Double priceMin, Double priceMax,
                                                  String categoryName, List<String> storeIds, Integer quantityMin, Integer quantityMax,
                                                  int page, int size, String sortBy, boolean descending) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String username = authentication.getName();
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        if (storeIds != null && storeIds.isEmpty()) {
            storeIds = null;
        }
        productID = (productID != null && !productID.trim().isEmpty()) ? productID.trim() : null;
        Page<Product> list = productRepository.findProducts(productID, productName, priceMin, priceMax, categoryName, storeIds, quantityMin, quantityMax, username, pageable);
        return list.map(productConverter::toStoreProductDTO);
    }

    public StoreProductDetailDTO getStoreProduct(String id) {
        Product product = checkProductOfUser(id);
        return productConverter.toStoreProductDetailDTO(product);
    }

    @Transactional
    public StoreProductDetailDTO updateStoreProduct(String productID, StoreProductDetailDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String username = authentication.getName();
        List<Store> stores = storeRepository.findByUserName(username);
        Product product = checkProductOfUser(productID);
        boolean a = product.getName().equals(dto.getName());
        boolean checkExist = productRepository.existsByNameAndStoreIn(dto.getName(), stores);
        if(checkExist && !a){
            throw new AppException(ErrorCode.PRODUCT_NAME_EXISTED);
        }
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setInformation(dto.getInformation());
        product.setProductImage(dto.getProductImage());
        Category category = categoryRepository.findById(dto.getCategory().getId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
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
            throw new AppException(ErrorCode.CANT_UPLOAD_IMAGE);
        }
    }

    @Transactional
    public void deleteProduct(String productId) {
        Product product = checkProductOfUser(productId);
        List<Zone> zones = product.getZones();
        zones.forEach(zone -> {
            zone.setProduct(null);
            zoneRepository.save(zone);
        });
        productRepository.delete(product);
    }

    @Override
    public Page<StoreDetailProductDTO> getProductsByFilter(String storeID,
                                                           String name,
                                                           Double fromPrice,
                                                           Double toPrice,
                                                           String information,
                                                           LocalDate fromCreatedAt,
                                                           LocalDate toCreatedAt,
                                                           LocalDate fromUpdatedAt,
                                                           LocalDate toUpdatedAt,
                                                           int page,
                                                           int size,
                                                           String sortBy,
                                                           boolean descending
    ) {
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        LocalDateTime startCreatedDateTime = fromCreatedAt != null ? fromCreatedAt.atStartOfDay() : null;
        LocalDateTime endCreatedDateTime = toCreatedAt != null ? toCreatedAt.atTime(LocalTime.MAX) : null;
        LocalDateTime startUpdatedDateTime = fromUpdatedAt != null ? fromUpdatedAt.atStartOfDay() : null;
        LocalDateTime endUpdatedDateTime = toUpdatedAt != null ? toUpdatedAt.atTime(LocalTime.MAX) : null;
        System.out.println(name);
        Page<Product> products = productRepository.findProducts(
                storeID, name, fromPrice, toPrice, information,
                startCreatedDateTime, endCreatedDateTime, startUpdatedDateTime, endUpdatedDateTime, pageable);
        return products.map(productConverter::toStoreDetailProductDTO);
    }

    @Override
    public void deleteProductStore(String productId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        List<Zone> zones = product.getZones();
        zones.forEach(zone -> {
            zone.setProduct(null);
            zoneRepository.save(zone);
        });
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
    public Page<EmployeeProductDTO> getProductBySearch(String name, int page, int size,
                                                       String sortBy, boolean descending,Long minQuantity, Long maxQuantity,String attributes) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Tài khoản không tồn tại"));
        Employee a = employeeRepository.findStoreIdByAccountEmpId(account.getId());
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        if (name.equals("") || name.isEmpty()) {
            name = null;
        } else {
            name = name.toLowerCase();
            name = capitalizeFirstLetters(name);
            System.out.println(name);
        }
        List<String> attributeList = (attributes != null && !attributes.isEmpty())
                ? Arrays.asList(attributes.split(","))
                : null;
        Long attributeCount = attributeList != null ? (long) attributeList.size() : 0L;
        Page<Product> productPage = productRepository.findByNameAndStoreIdContainingIgnoreCase(
                name, a.getStore().getId(), pageable, minQuantity, maxQuantity, attributeList, attributeCount);
        return productPage.map(productConverter::toEmployeeProductDTO);
    }

    @Override
    public List<EmployeeProductDTO> getProductBySearchInList(String name) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Tài khoản không tồn tại"));
        Employee a = employeeRepository.findStoreIdByAccountEmpId(account.getId());
        if (name.equals("") || name.isEmpty()) {
            name = null;
        } else {
            name = name.toLowerCase();
            name = capitalizeFirstLetters(name);
        }
        List<Product> productPage = productRepository.findByNameAndStoreIdContainingIgnoreCaseInList(name, a.getStore().getId());
        return productPage.stream().map(productConverter::toEmployeeProductDTO).collect(Collectors.toList());

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
    public Page<StoreDetailProductDTO> getAllProductsByStoreID(String search, String storeID, int page, int size, String sortBy, boolean descending) {
        Sort sort = descending
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        List<StoreDetailProductDTO> productPages;
        long total;
        if (search == null || search.isEmpty()) {
            List<Product> products = productRepository.findProductsByStoreID(storeID, pageable);
            productPages = products.stream().map(productConverter::toStoreDetailProductDTO).collect(Collectors.toList());
            total = productRepository.countByStore_Id(storeID);
        } else {
            List<Product> filteredProducts = productRepository.findProductsByInformationAndNameContainingIgnoreCase(search, storeID, pageable);
            productPages = filteredProducts.stream().map(productConverter::toStoreDetailProductDTO).collect(Collectors.toList());
            total = productRepository.countByInformationAndNameContainingIgnoreCase(search, storeID); // Đếm tổng số sản phẩm theo điều kiện search
        }
        return new PageImpl<>(productPages, pageable, total);
    }

    @Override
    public Page<CustomerProductDTO> searchProductsQuery(String querySearchName, String storeID, Double minPrice, Double maxPrice, int page, int size, String sortBy, boolean descending, String categoryID) {
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> products = productRepository
                .findByNameContainingAndPriceBetweenInStoreID(querySearchName, storeID, minPrice, maxPrice, pageable);
        Page<CustomerProductDTO> productPages;
        if (categoryID != null && !categoryID.isEmpty()) {
            productPages = productRepository.findAllProductStoreByCategoryId(storeID, categoryID, pageable)
                    .map(productConverter::toCustomerProductDTO);
        } else {
            productPages = products.map(productConverter::toCustomerProductDTO);
        }
        return productPages;
    }

    @Override
    @Transactional
    public void addProduct(String storeID, StoreDetailProductDTO storeDetailProductDTO) throws Exception {
        try {
            if (productRepository.existsProductByNameAndStore_Id(storeID, storeDetailProductDTO.getName() )) {
                throw new AppException(ErrorCode.PRODUCT_NAME_EXISTED);
            }
            Product newProduct = new Product();

            Category cateExisting = categoryRepository
                    .findCategoryById(storeDetailProductDTO.getCategoryID());
            if (cateExisting == null) {
                throw new Exception("Category does not exist");
            }
            
            newProduct.setName(storeDetailProductDTO.getName());
            newProduct.setPrice(storeDetailProductDTO.getPrice());
            newProduct.setInformation(storeDetailProductDTO.getInformation());
            newProduct.setCategory(cateExisting);
            newProduct.setQuantity(0L);
            newProduct.setProductImage(storeDetailProductDTO.getProductImage());

            if(storeDetailProductDTO.getProductAttributeList() != null) {
                List<ProductAttribute> attributes = storeDetailProductDTO.getProductAttributeList().stream()
                        .map(id -> {
                            try {
                                return productAttributeRepository.findById(id)
                                        .orElseThrow(() -> new Exception("ProductAttribute not found for ID: " + id));
                            } catch (Exception e) {
                                throw new RuntimeException(e);
                            }
                        })
                        .collect(Collectors.toList());

                newProduct.setProductAttributes(attributes);
            }
            if(storeDetailProductDTO.getZoneList() != null) {
                List<Zone> zones = storeDetailProductDTO.getZoneList().stream()
                        .map(id -> {
                            try {
                                return zoneRepository.findById(id)
                                        .orElseThrow(() -> new Exception("Zone not found for ID: " + id));
                            } catch (Exception e) {
                                throw new RuntimeException(e);
                            }
                        }).collect(Collectors.toList());
                newProduct.setZones(zones);
            }
            newProduct.setStore(storeRepository.getReferenceById(storeID));
            productRepository.save(newProduct);
        } catch (Exception e) {
            throw new Exception("Failed to save product: " + e.getMessage());
        }
    }

    @Override
    public void updateProduct(String storeID, String productID, StoreDetailProductDTO storeDetailProductDTO) throws Exception {
        Product updatingProduct = productRepository
                .findById(productID)
                .orElseThrow(() -> new Exception("Product not found for ID: " + storeDetailProductDTO.getId()));
        if(productRepository.existsProductByNameAndStore_IdAndIdNot(storeDetailProductDTO.getName(), storeID, productID)) {
            throw new AppException(ErrorCode.PRODUCT_NAME_EXISTED);
        }
        updatingProduct.setName(storeDetailProductDTO.getName());
        updatingProduct.setPrice(storeDetailProductDTO.getPrice());
        updatingProduct.setInformation(storeDetailProductDTO.getInformation());
        updatingProduct.setQuantity(updatingProduct.getQuantity());
        updatingProduct.setProductImage(storeDetailProductDTO.getProductImage());
        Category cateExisting = categoryRepository
                .findById(storeDetailProductDTO.getCategoryID())
                .orElseThrow(() -> new Exception("không tìm thấy category"));
        if (cateExisting == null) {
            throw new Exception("Category does not exist");
        }
        updatingProduct.setCategory(cateExisting);

        if(storeDetailProductDTO.getProductAttributeList() != null) {
            List<ProductAttribute> attributes = storeDetailProductDTO.getProductAttributeList().stream()
                    .map(id -> {
                        try {
                            return productAttributeRepository.findById(id)
                                    .orElseThrow(() -> new Exception("ProductAttribute not found for ID: " + id));
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    })
                    .collect(Collectors.toList());

            updatingProduct.setProductAttributes(attributes);
        }
        List<Zone> oldZones = new ArrayList<>(updatingProduct.getZones());
        updatingProduct.getZones().clear();
        for (String zoneId : storeDetailProductDTO.getZoneList()) {
            Zone zone = zoneRepository.findById(zoneId).orElse(new Zone());
            zone.setName(zone.getName());
            zone.setProduct(updatingProduct);
            updatingProduct.getZones().add(zone);
        }
        for (Zone oldZone : oldZones) {
            if (!updatingProduct.getZones().contains(oldZone)) {
                oldZone.setProduct(null);
                zoneRepository.save(oldZone);
            }
        }
        productRepository.save(updatingProduct);
    }

    //hàm cắt chuỗi in hoa chữ đầu cho mọi người
    public String capitalizeFirstLetters(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }
        String[] words = input.split("\\s+");
        StringBuilder capitalizedString = new StringBuilder();
        for (String word : words) {
            if (word.length() > 0) {
                capitalizedString.append(word.substring(0, 1).toUpperCase())
                        .append(word.substring(1).toLowerCase())
                        .append(" ");
            }
        }
        return capitalizedString.toString().trim();
    }
}