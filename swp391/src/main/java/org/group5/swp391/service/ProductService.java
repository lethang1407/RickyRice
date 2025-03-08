package org.group5.swp391.service;

import org.group5.swp391.dto.customer_requirement.CustomerProductDTO;
import org.group5.swp391.dto.employee.EmployeeProductDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductService {
    public Page<StoreProductDTO> getProducts(String productName, int page, int size, String sortBy, boolean descending);
    public Page<EmployeeProductDTO> getProductsByCateID(String CateID, int page, int size, String sortBy, boolean descending);
    public Page<EmployeeProductDTO>getProductBySearch(String name, int page, int size, String sortBy, boolean descending);
    public List<EmployeeProductDTO>getProductBySearchInList(String name);
    public Page<CustomerProductDTO> getAllProducts();
    public Page<CustomerProductDTO> searchProducts(String query, int page, int size);
    public Page<CustomerProductDTO> searchProductsQuery(String querySearchName, Double minPrice, Double maxPrice, int page, int size, String sortBy, boolean descending);
}