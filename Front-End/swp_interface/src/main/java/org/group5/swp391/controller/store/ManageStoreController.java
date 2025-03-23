package org.group5.swp391.controller.store;

import jakarta.validation.Valid;
import org.group5.swp391.dto.request.store_request.StoreRequest;
import org.group5.swp391.dto.response.store_response.StoreResponse;
import org.group5.swp391.service.StoreService;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/manage-store")
@RequiredArgsConstructor
public class ManageStoreController {

    private final StoreService storeService;

    // Tạo cửa hàng mới
    @PostMapping("/create-store/{transaction}")
    public ApiResponse<StoreResponse> createNewStore(@RequestBody @Valid StoreRequest request, @PathVariable String transaction) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        StoreResponse createdStore = storeService.createNewStore(request, transaction, username);
        return ApiResponse.<StoreResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Create store Success")
                .data(createdStore)
                .build();
    }

    // Danh sách những yêu cầu tạo cửa hàng mới được xử lí
    @GetMapping("/request-store")
    public ApiResponse<List<Map<String, Object>>> requestStore() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Map<String, Object>> stores = storeService.getRequestCreateStores(username);
        return ApiResponse.<List<Map<String, Object>>>builder()
                .code(HttpStatus.OK.value())
                .message("Request store success")
                .data(stores)
                .build();
    }

    // Xử lí thanh toán tạo cửa hàng và cập nhật thời hạn
    @GetMapping("/handle-payment")
    public ApiResponse<String> handlePayment(@RequestParam("order_id") String vnp_TxnRef, @RequestParam("trans_date") String vnp_TransDate,
                                             HttpServletRequest req) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String transaction = storeService.handlePayment(username, vnp_TxnRef, vnp_TransDate, req);
        return ApiResponse.<String>builder()
                .code(HttpStatus.OK.value())
                .message("Payment success")
                .data(transaction)
                .build();
    }

    // Cập nhật thông tin cửa hàng
    @PatchMapping("/update-store/{storeID}")
    public ApiResponse<StoreResponse> updateStoreInfor(@PathVariable String storeID, @RequestBody @Valid StoreRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        StoreResponse updateRespone = storeService.updateStoreInfor(storeID, request, username);
        return ApiResponse.<StoreResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Update store success")
                .data(updateRespone)
                .build();
    }

    // Lấy thông tin của 1 Store theo ID
    @GetMapping("/get-store/{storeID}")
    public ApiResponse<StoreResponse> getStoreInfo(@PathVariable String storeID) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        StoreResponse store = storeService.getStoreById(storeID, username);
        return ApiResponse.<StoreResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Get information store success")
                .data(store)
                .build();
    }
}
