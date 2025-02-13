package org.group5.swp391.Service;

import org.group5.swp391.DTO.StoreOwnerDTO.ProductDTO;
import org.springframework.data.domain.Page;

public interface ProductService {
    public Page<ProductDTO> getProducts(int page, int size, String sortBy, boolean descending);
    public Page<ProductDTO> searchProducts(String productName, int page, int size, String sortBy, boolean descending);
}