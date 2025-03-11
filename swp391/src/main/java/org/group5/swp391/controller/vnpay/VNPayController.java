package org.group5.swp391.controller.vnpay;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.response.ApiResponse;
import org.group5.swp391.service.VNPayService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


import java.io.UnsupportedEncodingException;


@RestController
@RequestMapping("/vnpay")
@RequiredArgsConstructor
public class VNPayController {

    private final VNPayService vnPayService;

    // Tạo yêu cầu thanh toán cho các gói dịch vụ
    @GetMapping("/create-payment")
    public ApiResponse<String> createPayment(HttpServletRequest request,
                                             @RequestParam double amount,
                                             @RequestParam String subscriptionPlanId) throws UnsupportedEncodingException {
        String paymentUrl = vnPayService.createPayment(request, amount, subscriptionPlanId);
        return ApiResponse.<String>builder()
                .code(HttpStatus.OK.value())
                .message("Request payment created successfully!")
                .data(paymentUrl)
                .build();
    }

    // Truy xuất giao dịch thanh toán từ VN Pay
    @PostMapping("/payment-history")
    public ApiResponse<String> paymentHistory(@RequestParam("order_id") String vnp_TxnRef,
                                              @RequestParam("trans_date") String vnp_TransDate,
                                              HttpServletRequest req) {
        String transaction = vnPayService.queryPayment(vnp_TxnRef, vnp_TransDate, req);
        return ApiResponse.<String>builder()
                .code(HttpStatus.OK.value())
                .message("Request payment history successfully!")
                .data(transaction)
                .build();
    }
}

