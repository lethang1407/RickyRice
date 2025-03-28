package org.group5.swp391.service;

import jakarta.servlet.http.HttpServletRequest;
import org.group5.swp391.dto.request.store_request.StoreRequest;
import org.group5.swp391.dto.response.AdminResponse.ViewStoreResponse;
import org.group5.swp391.dto.response.store_response.StoreResponse;
import org.group5.swp391.dto.store_owner.all_store.StoreInfoDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface StoreService {
    public Page<StoreInfoDTO> getStores(String storeName, int page, int size, String sortBy, boolean descending);

    public List<ViewStoreResponse> getAllStores();

    public List<StoreInfoDTO> getStoresForDebt();

    public List<StoreInfoDTO> getStoresInfoIdAndName();

    StoreResponse createNewStore(StoreRequest request, String transactionNo, String username);

    String handlePayment(String username, String vnp_TxnRef, String vnp_TransDate, HttpServletRequest req);

    StoreResponse updateStoreInfor(String storeID, StoreRequest request, String username);

    List<Map<String, Object>> getRequestCreateStores(String username);

    StoreResponse getStoreById(String storeID, String username);
}