package org.group5.swp391.service;

import org.group5.swp391.dto.response.AdminResponse.ViewStoreResponse;
import org.group5.swp391.dto.store_owner.all_store.StoreInfoDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface StoreService {
    public Page<StoreInfoDTO> getStores(String storeName, int page, int size, String sortBy, boolean descending);
    public List<ViewStoreResponse> getAllStores();
}