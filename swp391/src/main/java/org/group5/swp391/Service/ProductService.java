package org.group5.swp391.Service;

import org.group5.swp391.DTO.CustomerRequirementDTO.CustomerProductDTO;
import org.group5.swp391.DTO.EmployeeDTO.EmployeeProductDTO;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface ProductService {
    public Page<StoreProductDTO> getProducts(int page, int size, String sortBy, boolean descending);
    public Page<StoreProductDTO> searchProducts(String productName, int page, int size, String sortBy, boolean descending);
    public Page<EmployeeProductDTO> getProductsByCateID(String CateID, int page, int size, String sortBy, boolean descending);
    public Page<EmployeeProductDTO>getProductBySearch(String name, String categoryID, int page, int size, String sortBy, boolean descending);
    public Page<CustomerProductDTO> getAllProducts();
    public Page<CustomerProductDTO> searchProducts(String query, int page, int size);
}