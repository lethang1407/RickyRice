package org.group5.swp391.service;

import org.group5.swp391.dto.employee.EmployeeProductAttributeDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreProductAttributeDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductAttributeService {
    public List<StoreProductAttributeDTO> getProductAttributes();
    public List<EmployeeProductAttributeDTO> getALLProductAttributes2();
}
