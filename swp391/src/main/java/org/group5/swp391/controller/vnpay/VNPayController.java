package org.group5.swp391.controller.vnpay;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.response.ApiResponse;
import org.group5.swp391.service.StoreService;
import org.group5.swp391.service.VNPayService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


import java.io.UnsupportedEncodingException;
import java.util.Map;


@RestController
@RequestMapping("/vnpay")
@RequiredArgsConstructor
public class VNPayController {

    private final VNPayService vnPayService;

    // Tạo yêu cầu thanh toán cho các gói dịch vụ để tạo cửa hàng mới
    @GetMapping("/payment")
    public ApiResponse<String> createPayment(HttpServletRequest request,
                                             @RequestParam double amount,
                                             @RequestParam String subscriptionPlanId) throws UnsupportedEncodingException {
        String storeID = request.getParameter("storeID");
        String paymentUrl = vnPayService.createPayment(request, amount, subscriptionPlanId, storeID);
        return ApiResponse.<String>builder()
                .code(HttpStatus.OK.value())
                .message("Request payment created successfully!")
                .data(paymentUrl)
                .build();
    }

    // Tra cứu lịch sử giao dịch
    @GetMapping("/payment-history")
    public ApiResponse<Map<String, Object>> queryPayment(
            @RequestParam String vnp_TxnRef,
            @RequestParam String vnp_TransDate,
            HttpServletRequest req) {

        Map<String, Object> data = vnPayService.queryPayment(vnp_TxnRef, vnp_TransDate, req);

        return ApiResponse.<Map<String, Object>>builder()
                .code(HttpStatus.OK.value())
                .message("Request payment created successfully!")
                .data(data)
                .build();
    }

}

