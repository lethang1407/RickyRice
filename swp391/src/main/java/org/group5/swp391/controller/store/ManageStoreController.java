package org.group5.swp391.controller.store;

import jakarta.validation.Valid;
import org.group5.swp391.dto.request.store_request.StoreRequest;
import org.group5.swp391.dto.response.store_response.StoreResponse;
import org.group5.swp391.service.AppStatisticsService;
import org.group5.swp391.service.StoreService;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;


import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/manage-store")
@RequiredArgsConstructor
public class ManageStoreController {

    private final StoreService storeService;
    private final AppStatisticsService appStatisticsService;
    private final RestClient.Builder builder;

    // Tra cứu lịch sử giao dịch để tạo cửa hàng mới
    @PostMapping("/payment-create-store")
    public ApiResponse<Map<String, Object>> paymentCreateStore(
            @RequestParam("order_id") String vnp_TxnRef,
            @RequestParam("trans_date") String vnp_TransDate,
            HttpServletRequest req) {

        // Lấy username từ JWT
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Map<String, Object> transaction = storeService.paymentCreateStore(username, vnp_TxnRef, vnp_TransDate, req);

        // Trả về response với thông báo thành công
        return ApiResponse.<Map<String, Object>>builder()
                .code(HttpStatus.OK.value())
                .message("Success")
                .data(transaction)
                .build();
    }

    // Tạo cửa hàng mới
    @PostMapping("/create-store/{transaction}")
    public ApiResponse<StoreResponse> createNewStore(@RequestBody @Valid StoreRequest request, @PathVariable String transaction) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        StoreResponse createdStore = storeService.createNewStore(request, transaction, username);
        return ApiResponse.<StoreResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Success")
                .data(createdStore)
                .build();
    }

    // Danh sách những yêu cầu tạo cửa hàng mới được xử lí
    @GetMapping("/request-store")
    public ApiResponse<List<String>> requestStore() {
        List<String> listStoreNull = appStatisticsService.getTransactionNosWithNullStore();
        return ApiResponse.<List<String>>builder()
                .code(HttpStatus.OK.value())
                .message("Success")
                .data(listStoreNull)
                .build();
    }
}
