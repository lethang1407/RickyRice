package org.group5.swp391.controller.vnpay;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.response.ApiResponse;
import org.group5.swp391.repository.InvalidatedTokenRepository;
import org.group5.swp391.service.VNPayService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


import java.io.UnsupportedEncodingException;


@RestController
@RequestMapping("/vnpay")
@RequiredArgsConstructor
public class VNPayController {

    private final VNPayService vnPayService;
    private final InvalidatedTokenRepository invalidatedTokenRepository;

    // Tạo yêu cầu thanh toán cho các gói dịch vụ để tạo cửa hàng mới
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
}

