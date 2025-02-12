package org.group5.swp391.Service.StoreOwnerService;

import org.group5.swp391.DTO.StoreOwnerDTO.StoreDTO;
import org.springframework.data.domain.Page;

public interface StoreService {
    public Page<StoreDTO> getStores(int page, int size, String sortBy, boolean descending);
    public Page<StoreDTO> searchStores(String storeName,int page, int size, String sortBy, boolean descending);

}