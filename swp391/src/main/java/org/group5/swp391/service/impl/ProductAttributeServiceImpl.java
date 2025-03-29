package org.group5.swp391.service.impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.ProductAttributeConverter;
import org.group5.swp391.dto.employee.EmployeeProductAttributeDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreProductAttributeDTO;
import org.group5.swp391.dto.store_owner.store_detail.StoreDetailProductAttributeDTO;
import org.group5.swp391.entity.ProductAttribute;
import org.group5.swp391.exception.AppException;
import org.group5.swp391.exception.ErrorCode;
import org.group5.swp391.repository.ProductAttributeRepository;
import org.group5.swp391.repository.StoreRepository;
import org.group5.swp391.repository.ZoneRepository;
import org.group5.swp391.service.ProductAttributeService;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductAttributeServiceImpl implements ProductAttributeService {
    private final ProductAttributeRepository productAttributeRepository;
    private final ProductAttributeConverter productAttributeConverter;
    private final StoreRepository storeRepository;
    private final ZoneRepository zoneRepository;

    @Override
    public List<StoreProductAttributeDTO> getProductAttributes() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Người dùng chưa đăng nhập!");
        }
        String username = authentication.getName();
        return productAttributeRepository.findProductAttributeForUser(username).stream().map(productAttributeConverter::toStoreProductAttributeDTO).toList();
    }
    @Override
    public List<EmployeeProductAttributeDTO> getALLProductAttributes2() {
        return productAttributeRepository.findAll().stream().map(productAttributeConverter::toEmpProductAttributeDTO).toList();
    }
    //Hieu
    @Override
    public Page<StoreDetailProductAttributeDTO> getProductAttributeByStoreID(String storeID, int page, int size, String sortBy, boolean descending) {
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        List<ProductAttribute> productAttributes = productAttributeRepository.findAllByStore_Id(storeID, pageable);
        List<StoreDetailProductAttributeDTO> storeProductAttributeDTOS = productAttributes
                .stream()
                .map(productAttributeConverter::toStoreDetailProductAttributeDTO).toList();
        Long totalElements = productAttributeRepository.countAllByStore_Id(storeID);
        return new PageImpl<>(storeProductAttributeDTOS, pageable, totalElements);
    }

    @Override
    public void addProductAttribute(StoreDetailProductAttributeDTO storeDetailProductAttributeDTO) throws Exception {
        ProductAttribute productAttribute = new ProductAttribute();
        productAttribute.setValue(storeDetailProductAttributeDTO.getValue());
        productAttribute.setStore(storeRepository.findById(storeDetailProductAttributeDTO.getStoreID()).orElseThrow(() -> new Exception("Không tìm thấy store id")));
        productAttributeRepository.save(productAttribute);
    }

    @Override
    public void updateProductAttribute(String productAttributeID, StoreDetailProductAttributeDTO storeDetailProductAttributeDTO) throws Exception {
        ProductAttribute productAttribute = productAttributeRepository
                .findById(productAttributeID)
                .orElseThrow(() -> new Exception("Không tìm thấy thuộc tính"));
        productAttribute.setValue(storeDetailProductAttributeDTO.getValue());
        productAttributeRepository.save(productAttribute);
    }

    @Override
    public void deleteProductAttribute(String id) {
        ProductAttribute productAttribute = productAttributeRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        productAttribute.setProducts(null);
        productAttribute.setStore(null);
        productAttributeRepository.delete(productAttribute);
    }
}
