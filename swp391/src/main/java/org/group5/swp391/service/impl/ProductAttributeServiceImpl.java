package org.group5.swp391.service.impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.ProductAttributeConverter;
import org.group5.swp391.dto.employee.EmployeeProductAttributeDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreProductAttributeDTO;
import org.group5.swp391.repository.ProductAttributeRepository;
import org.group5.swp391.service.ProductAttributeService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductAttributeServiceImpl implements ProductAttributeService {
    private final ProductAttributeRepository productAttributeRepository;
    private final ProductAttributeConverter productAttributeConverter;
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
}
