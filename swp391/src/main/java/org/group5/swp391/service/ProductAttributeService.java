package org.group5.swp391.service;

import org.group5.swp391.dto.employee.EmployeeProductAttributeDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreProductAttributeDTO;
import org.group5.swp391.dto.store_owner.store_detail.StoreDetailProductAttributeDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductAttributeService {
    public List<StoreProductAttributeDTO> getProductAttributes();
    public Page<StoreDetailProductAttributeDTO> getProductAttributeByStoreID(String storeID, int page, int size, String sortBy, boolean descending);
    public void addProductAttribute(StoreDetailProductAttributeDTO storeProductAttributeDTO) throws Exception;
    public void updateProductAttribute(String productAttributeID, StoreDetailProductAttributeDTO storeProductAttributeDTO) throws Exception;
    public void deleteProductAttribute(String id);
    public List<EmployeeProductAttributeDTO> getALLProductAttributes2();
}
