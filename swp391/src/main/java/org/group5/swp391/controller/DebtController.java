package org.group5.swp391.controller;

import com.cloudinary.Api;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.debt.*;
import org.group5.swp391.dto.employee.CustomerUpdateRequest;
import org.group5.swp391.dto.employee.EmployeeCustomerDTO;
import org.group5.swp391.dto.request.authentication_request.IntrospectRequest;
import org.group5.swp391.dto.response.ApiResponse;
import org.group5.swp391.dto.response.AuthenticationResponse.AuthenticationResponse;
import org.group5.swp391.dto.response.PageResponse;
import org.group5.swp391.dto.store_owner.all_store.StoreInfoDTO;
import org.group5.swp391.entity.Customer;
import org.group5.swp391.enums.DebtType;
import org.group5.swp391.repository.CustomerRepository;
import org.group5.swp391.service.AuthenticationService;
import org.group5.swp391.service.CustomerService;
import org.group5.swp391.service.DebtService;
import org.group5.swp391.service.StoreService;
import org.group5.swp391.service.impl.CustomerServiceImpl;
import org.group5.swp391.utils.CurrentUserDetails;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
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
    private final AuthenticationService authenticationService;

    @PostMapping("")
    public ApiResponse<String> createDebt(@RequestBody @Valid DebtCreationRequest request){
        if(StringUtils.hasLength(request.getPhoneNumber())){
            Customer customer = customerService.getCustomerByPhone(request.getPhoneNumber());
            request.setCustomerId(customer.getId());
        }
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

    @PostMapping(value = "/refresh")
    public ApiResponse<AuthenticationResponse> refresh(@RequestBody @Valid IntrospectRequest request) throws ParseException, JOSEException {
        AuthenticationResponse response = authenticationService.refresh(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .code(200)
                .data(response)
                .message("Success")
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

    @PreAuthorize("@securityService.hasAccessToStore(#storeId)")
    @GetMapping("/customer-debt")
    public ApiResponse<PageResponse<DebtCustomerDTO>> getDebtCustomer(@RequestParam(defaultValue = "1") Integer pageNo,
                                                                      @RequestParam(defaultValue = "10") Integer pageSize,
                                                                      @RequestParam(required = false) String sortBy,
                                                                      @RequestParam(defaultValue = "") String storeId,
                                                                      @RequestParam(required = false) LocalDate startCreatedAt,
                                                                      @RequestParam(required = false) LocalDate endCreatedAt,
                                                                      @RequestParam(required = false) LocalDate startUpdatedAt,
                                                                      @RequestParam(required = false) LocalDate endUpdatedAt,
                                                                      @RequestParam(required = false) String customerName,
                                                                      @RequestParam(required = false) String phoneNumber,
                                                                      @RequestParam(required = false) String email,
                                                                      @RequestParam(required = false) String address,
                                                                      @RequestParam(required = false) Double fromAmount,
                                                                      @RequestParam(required = false) Double toAmount,
                                                                      @RequestParam(required = false) String createdBy){
        PageResponse<DebtCustomerDTO> response = customerService.getDebtCustomers(pageNo, pageSize, sortBy, storeId, startCreatedAt, endCreatedAt, startUpdatedAt,
                                                                            endUpdatedAt, customerName, phoneNumber,email, address, fromAmount, toAmount, createdBy);
        return ApiResponse.<PageResponse<DebtCustomerDTO>>builder()
                .data(response)
                .message("Get data successfully")
                .code(200)
                .build();
    }

    @GetMapping("/customer-debt/{id}")
    public ApiResponse<PageResponse<DebtDTO>> getDetailDebtCustomer(@PathVariable("id") String customerId,
                                                              @RequestParam(defaultValue = "1") Integer pageNo,
                                                              @RequestParam(defaultValue = "5") Integer pageSize,
                                                              @RequestParam(required = false) String sortBy,
                                                              @RequestParam(required = false) String number,
                                                              @RequestParam(required = false) String type,
                                                              @RequestParam(required = false) LocalDate startCreatedAt,
                                                              @RequestParam(required = false) LocalDate endCreatedAt,
                                                              @RequestParam(required = false) Double fromAmount,
                                                              @RequestParam(required = false) Double toAmount,
                                                              @RequestParam(required = false) String createdBy){
        PageResponse<DebtDTO> debts = debtService.searchForDetailCustomerDebt(pageNo, pageSize, sortBy, customerId, number, type ,startCreatedAt,
                                                                                endCreatedAt, fromAmount, toAmount, createdBy);

        return ApiResponse.<PageResponse<DebtDTO>>builder()
                .data(debts)
                .code(200)
                .message("Get data successfully")
                .build();
    }

    @PostMapping("/customer")
    public ApiResponse<Void> createCustomer(@Valid @RequestBody CustomerCreationRequest request){
        customerService.createCustomerDebt(request);
        return ApiResponse.<Void>builder()
                .message("Create customer successfully")
                .code(201)
                .build();
    }

    @PutMapping("/customer/{id}")
    public ApiResponse<Void> updateCustomer(@PathVariable String id,
                                            @Valid @RequestBody CustomerDebtUpdateRequest request){
        customerService.updateCustomerDebt(id,request);
        return ApiResponse.<Void>builder()
                .message("Create customer successfully")
                .code(201)
                .build();
    }

    @GetMapping("/customer/{id}")
    public ApiResponse<DebtCustomerDTO> getDebtCustomerById(@PathVariable String id){
        DebtCustomerDTO res = customerService.getDebtCustomerById(id);
        return ApiResponse.<DebtCustomerDTO>builder()
                .data(res)
                .code(200)
                .message("Get customer successfully")
                .build();
    }

}
