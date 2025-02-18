package org.group5.swp391.Service;

import org.group5.swp391.DTO.Response.AdminResponse.ViewStoreResponse;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreInfoDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface StoreService {
    public Page<StoreInfoDTO> getStores(String storeName, int page, int size, String sortBy, boolean descending);
    public List<ViewStoreResponse> getAllStores();
}