package org.group5.swp391.service;

import jakarta.servlet.http.HttpServletRequest;
import org.group5.swp391.dto.request.store_request.StoreRequest;
import org.group5.swp391.dto.response.AdminResponse.ViewStoreResponse;
import org.group5.swp391.dto.response.store_response.StoreResponse;
import org.group5.swp391.dto.store_owner.all_store.StoreInfoDTO;
import org.group5.swp391.entity.Store;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface StoreService {
    public Page<StoreInfoDTO> getStores(String storeName, int page, int size, String sortBy, boolean descending);

    public List<ViewStoreResponse> getAllStores();

    public List<StoreInfoDTO> getStoresForDebt();

    // kiểm tra giao dịch để tạo cửa hàng mới
    Map<String, Object> paymentCreateStore(String username, String vnp_TxnRef, String vnp_TransDate, HttpServletRequest req);

    // tạo cửa hàng mới
    StoreResponse createNewStore(StoreRequest request, String transactionNo, String username);
}