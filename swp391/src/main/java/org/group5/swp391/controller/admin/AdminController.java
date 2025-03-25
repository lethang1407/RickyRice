package org.group5.swp391.controller.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.request.admin_request.SubscriptionPlanRequest;
import org.group5.swp391.dto.request.admin_request.UpdateAccountActiveRequest;
import org.group5.swp391.dto.response.*;
import org.group5.swp391.dto.response.AdminResponse.*;
import org.group5.swp391.dto.response.account_response.AccountResponse;
import org.group5.swp391.service.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AccountService accountService;
    private final AppStatisticsService appStatisticsService;
    private final StoreService storeService;
    private final SubscriptionPlanService subscriptionPlanService;

    // Xem danh sách tài khoản có role STORE_OWNER
    @GetMapping("/account-owner")
    public ApiResponse<List<AccountResponse>> getAccountOwner() {
        List<AccountResponse> accountResponses = accountService.getAccountsByRole("STORE_OWNER");

        return ApiResponse.<List<AccountResponse>>builder()
                .code(accountResponses.isEmpty() ? HttpStatus.NO_CONTENT.value() : HttpStatus.OK.value())
                .message(accountResponses.isEmpty() ? "No store owners found" : "Fetched store owners successfully")
                .data(accountResponses.isEmpty() ? null : accountResponses)
                .build();
    }

    // Lấy account theo ID
    @GetMapping("/account/{accountID}")
    public ApiResponse<AccountResponse> getAccountById(@PathVariable String accountID) {
        AccountResponse accountResponse = accountService.getAccountsByID(accountID);
        return ApiResponse.<AccountResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Fetched account successfully")
                .data(accountResponse)
                .build();
    }

    // Cập nhật trạng thái của tài khoản
    @PatchMapping("/account-active")
    public ApiResponse<Void> updateAccountActiveStatus(@RequestBody UpdateAccountActiveRequest request) {
        accountService.updateAccountActiveStatus(request);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Updated active status successfully.")
                .build();
    }

    // Xem thống kê các hoạt động dịch vụ của trang web
    @GetMapping("/view-revenue")
    public ApiResponse<List<AppStatisticsResponse>> viewRevenue() {
        List<AppStatisticsResponse> statistics = appStatisticsService.getStatistics();
        return ApiResponse.<List<AppStatisticsResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Fetched revenue statistics successfully")
                .data(statistics)
                .build();
    }

    // Xem danh sách cửa hàng sử dụng dịch vụ vủa trang web
    @GetMapping("/view-store")
    public ApiResponse<List<ViewStoreResponse>> viewStores() {
        List<ViewStoreResponse> stores = storeService.getAllStores();
        return ApiResponse.<List<ViewStoreResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Fetched store successfully")
                .data(stores)
                .build();
    }

    // Lấy danh sách các gói dịch vụ đăng kí của trang web
    @GetMapping("/subscription-plans")
    public ApiResponse<List<SubscriptionPlanResponse>> getAllSubscriptionPlans() {
        List<SubscriptionPlanResponse> plans = subscriptionPlanService.getAllSubscriptionPlans();
        return ApiResponse.<List<SubscriptionPlanResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Fetched subscription plans successfully")
                .data(plans)
                .build();
    }

    // Lấy gói dịch vụ đăng kí của trang web theo ID
    @GetMapping("/subscription-plan/{id}")
    public ApiResponse<SubscriptionPlanResponse> getSubscriptionPlanById(@PathVariable String id) {
        SubscriptionPlanResponse plan = subscriptionPlanService.getSubscriptionPlanById(id);
        return ApiResponse.<SubscriptionPlanResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Fetched subscription plan by ID successfully")
                .data(plan)
                .build();
    }

    // Thêm mới 1 gói dịch vụ của trang web
    @PostMapping("/create-subscription-plan")
    public ApiResponse<SubscriptionPlanResponse> createSubscriptionPlan(@RequestBody @Valid SubscriptionPlanRequest request) {
        SubscriptionPlanResponse plan = subscriptionPlanService.createSubscriptionPlan(request);
        return ApiResponse.<SubscriptionPlanResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Created subscription plan successfully")
                .data(plan)
                .build();
    }

    // Cập nhật gói dịch vụ của trang web
    @PutMapping("/update-subscription-plan/{id}")
    public ApiResponse<SubscriptionPlanResponse> updateSubscriptionPlan(
            @PathVariable String id, @RequestBody @Valid SubscriptionPlanRequest request) {
        SubscriptionPlanResponse updatedPlan = subscriptionPlanService.updateSubscriptionPlan(id, request);
        return ApiResponse.<SubscriptionPlanResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Updated subscription plan successfully")
                .data(updatedPlan)
                .build();
    }


    // ===============================================================
    @GetMapping("/test-revenue")
    public ApiResponse<Map<String, Object>> viewRevenue(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            @RequestParam(required = false) String subscriptionPlanName,
            @RequestParam(required = false) String searchQuery) {

        if (size > 100) {
            size = 100;
        }

        if (!sortDirection.equalsIgnoreCase("asc") && !sortDirection.equalsIgnoreCase("desc")) {
            sortDirection = "desc";
        }

        try {
            Page<AppStatisticsResponse> statistics = appStatisticsService.getStatistics(
                    page, size, sortBy, sortDirection, subscriptionPlanName, searchQuery);

            // Lấy danh sách subscriptionPlanName
            List<String> subscriptionPlans = appStatisticsService.getAllSubscriptionPlanNames();

            // Tính tổng doanh thu
            Double totalRevenue = appStatisticsService.calculateTotalRevenue();

            // Gói kết quả vào Map
            Map<String, Object> response = new HashMap<>();
            response.put("statistics", statistics);
            response.put("subscriptionPlans", subscriptionPlans);
            response.put("totalRevenue", totalRevenue);

            return ApiResponse.<Map<String, Object>>builder()
                    .code(HttpStatus.OK.value())
                    .message("Fetched revenue statistics successfully")
                    .data(response)
                    .build();

        } catch (Exception e) {
            return ApiResponse.<Map<String, Object>>builder()
                    .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Error fetching revenue statistics: " + e.getMessage())
                    .data(null)
                    .build();
        }
    }


}
