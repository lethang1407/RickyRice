package org.group5.swp391.Service;

import org.group5.swp391.DTO.Response.ViewStoreResponse;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface StoreService {
    public Page<StoreDTO> getStores(int page, int size, String sortBy, boolean descending);
    public Page<StoreDTO> searchStores(String storeName,int page, int size, String sortBy, boolean descending);
    public List<ViewStoreResponse> getAllStores();
}