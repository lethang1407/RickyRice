package org.group5.swp391.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.debt.DebtCreationRequest;
import org.group5.swp391.dto.debt.DebtDTO;
import org.group5.swp391.dto.employee.EmployeeCustomerDTO;
import org.group5.swp391.dto.response.ApiResponse;
import org.group5.swp391.dto.response.PageResponse;
import org.group5.swp391.dto.store_owner.all_store.StoreInfoDTO;
import org.group5.swp391.enums.DebtType;
import org.group5.swp391.service.CustomerService;
import org.group5.swp391.service.DebtService;
import org.group5.swp391.service.StoreService;
import org.group5.swp391.utils.CurrentUserDetails;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/debt")
@RequiredArgsConstructor
public class DebtController {
    private final RabbitTemplate rabbitTemplate;
    private final DebtService debtService;
    private final StoreService storeService;
    private final CustomerService customerService;

    @PostMapping("")
    public ApiResponse<String> createDebt(@RequestBody @Valid DebtCreationRequest request){
        request.setCreatedBy(SecurityContextHolder.getContext().getAuthentication().getName());
        rabbitTemplate.convertAndSend("debtExchange", "debtKey", request);
        return ApiResponse.<String>builder()
                .code(200)
                .data("Nợ đã được ghi nhận và đang xử lý!!!")
                .build();
    }

    @PreAuthorize("@securityService.hasAccessToStore(#storeId)")
    @GetMapping("")
    public ApiResponse<PageResponse<DebtDTO>> getDebts(@RequestParam(defaultValue = "1") Integer pageNo,
                                                       @RequestParam(defaultValue = "10") Integer pageSize,
                                                       @RequestParam(required = false) String sortBy,
                                                       @RequestParam(defaultValue = "") String storeId,
                                                       @RequestParam(required = false) String number,
                                                       @RequestParam(required = false) String type,
                                                       @RequestParam(required = false) LocalDate startCreatedAt,
                                                       @RequestParam(required = false) LocalDate endCreatedAt,
                                                       @RequestParam(required = false) String customerName,
                                                       @RequestParam(required = false) String phoneNumber,
                                                       @RequestParam(required = false) String email,
                                                       @RequestParam(required = false) String address,
                                                       @RequestParam(required = false) Double fromAmount,
                                                       @RequestParam(required = false) Double toAmount,
                                                       @RequestParam(required = false) String createdBy){

        PageResponse<DebtDTO> response = debtService.searchForDebt(pageNo, pageSize, sortBy, storeId, number, type, startCreatedAt, endCreatedAt,
                customerName, phoneNumber, email, address, fromAmount, toAmount, createdBy);

        return ApiResponse.<PageResponse<DebtDTO>>builder()
                .code(200)
                .data(response)
                .message("Get debts successfully!!!")
                .build();
    }

    @GetMapping("/store")
    public ApiResponse<List<StoreInfoDTO>> getStores(){
        List<StoreInfoDTO> res = storeService.getStoresForDebt();
        return ApiResponse.<List<StoreInfoDTO>>builder()
                .data(res)
                .message("Get stores successfully")
                .code(200)
                .build();
    }

    @GetMapping("/customer")
    public ApiResponse<List<EmployeeCustomerDTO>> getCustomers(){
        List<EmployeeCustomerDTO> list = customerService.getCustomerForDebt();
        return ApiResponse.<List<EmployeeCustomerDTO>>builder()
                .code(200)
                .data(list)
                .message("Get customer successfully")
                .build();
    }
}
