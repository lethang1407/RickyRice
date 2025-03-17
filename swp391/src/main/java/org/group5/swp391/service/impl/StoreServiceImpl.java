package org.group5.swp391.service.impl;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.StoreConverter;
import org.group5.swp391.dto.request.store_request.StoreRequest;
import org.group5.swp391.dto.response.AdminResponse.ViewStoreResponse;
import org.group5.swp391.dto.response.store_response.StoreResponse;
import org.group5.swp391.dto.store_owner.all_store.StoreInfoDTO;
import org.group5.swp391.entity.*;
import org.group5.swp391.exception.AppException;
import org.group5.swp391.exception.ErrorCode;
import org.group5.swp391.repository.*;
import org.group5.swp391.service.AccountService;
import org.group5.swp391.service.StoreService;
import org.group5.swp391.service.SubscriptionPlanService;
import org.group5.swp391.service.VNPayService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class StoreServiceImpl implements StoreService {
    private final StoreRepository storeRepository;
    private final StoreConverter storeConverter;
    private final AccountRepository accountRepository;
    private final VNPayService vnPayService;
    private final NotificationRepository notificationRepository;
    private final SubscriptionPlanService subscriptionPlanService;
    private final AppStatisticsRepository appStatisticsRepository;

    @Override
    public Page<StoreInfoDTO> getStores(String storeName, int page, int size, String sortBy, boolean descending) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username).orElseThrow(null);
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        if (storeName == null || storeName.isEmpty()) {
            return storeRepository.findByStoreAccount(account, pageRequest).map(storeConverter::toStoreDTO);
        }
        return storeRepository.findByStoreAccountAndStoreNameContainingIgnoreCase(account, storeName, pageRequest).map(storeConverter::toStoreDTO);
    }

    public List<ViewStoreResponse> getAllStores() {
        return storeRepository.findAll().stream().map(store ->
                ViewStoreResponse.builder()
                        .storeID(store.getId())
                        .storeName(store.getStoreName())
                        .address(store.getAddress())
                        .hotline(store.getHotline())
                        .description(store.getDescription())
                        .operatingHour(store.getOperatingHour())
                        .expireAt(store.getExpireAt())
                        .image(store.getImage())
                        .accountName(store.getStoreAccount().getUsername())
                        .subscriptionPlanID(store.getSubscriptionPlan().getId())
                        .createdAt(store.getCreatedAt())
                        .updateAt(store.getUpdatedAt())
                        .subscriptionPlanName(store.getSubscriptionPlan().getName())
                        .subscriptionPlanPrice(store.getSubscriptionPlan().getPrice())
                        .subscriptionTimeOfExpiration(store.getSubscriptionPlan().getTimeOfExpiration())
                        .build()
        ).collect(Collectors.toList());
    }

    @Override
    public List<StoreInfoDTO> getStoresForDebt() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Account account = accountRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        List<Store> storeList = account.getStores();
        return storeList.stream().map(
                        item -> StoreInfoDTO.builder()
                                .storeID(item.getId())
                                .storeName(item.getStoreName())
                                .build())
                .toList();
    }

    // Xử lí dữ liệu trả về để tạo cửa hàng mới
    @Transactional
    public Map<String, Object> paymentCreateStore(String username, String vnp_TxnRef, String vnp_TransDate, HttpServletRequest req) {
        // Gọi VNPay API để truy vấn giao dịch
        Map<String, Object> transaction = vnPayService.queryPayment(vnp_TxnRef, vnp_TransDate, req);

        // Kiểm tra nếu VNPay trả về lỗi
        if (transaction.containsKey("error")) {
            transaction.put("status", HttpStatus.BAD_REQUEST.value());
            transaction.put("message", "Failed to retrieve payment history: " + transaction.get("error"));
            return transaction;
        }

        // Kiểm tra vnp_ResponseCode (chỉ xử lý nếu == "00")
        String vnp_ResponseCode = (String) transaction.getOrDefault("vnp_ResponseCode", "99");
        if (!"00".equals(vnp_ResponseCode)) {
            transaction.put("status", HttpStatus.BAD_REQUEST.value());
            transaction.put("message", "vnp_ResponseCode: " + vnp_ResponseCode);
            return transaction;
        }

        // Lấy `vnp_TransactionNo` từ response VNPay (nếu có)
        String vnp_TransactionNo = (String) transaction.getOrDefault("vnp_TransactionNo", "UNKNOWN");

        // Kiểm tra nếu giao dịch đã tồn tại trong appStatistics
        if (appStatisticsRepository.existsByTransactionNo(vnp_TransactionNo)) {
            transaction.put("status", HttpStatus.OK.value());
            transaction.put("message", "Transaction already recorded.");
            return transaction;
        }

        // Lấy số tiền từ VNPay response (nếu có)
        String vnp_Amount = String.valueOf(transaction.getOrDefault("vnp_Amount", null));
        double amount = Double.parseDouble(vnp_Amount) / 100;

        String message = "Bạn đã thanh toán " + amount + " thành công. Vui lòng thực hiện tạo cửa hàng mới trong 30 ngày từ khi hoàn tất thanh toán.";

        // Tạo thông báo thanh toán thành công
        Notification notification = new Notification();
        Account account = accountRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        notification.setTargetAccount(account);
        notification.setCreatedBy("Admin");
        notification.setIsRead(false);
        notification.setMessage(message);
        notificationRepository.save(notification);

        // Lưu lịch sử giao dịch vào hệ thống
        AppStatistics appStatistics = new AppStatistics();
        appStatistics.setTransactionNo(vnp_TransactionNo);
        appStatistics.setSubcriptionDescription(message);
        appStatistics.setSubcriptionPlanName(subscriptionPlanService.getSubscriptionPlanByPrice(amount).getName());
        appStatistics.setSubcriptionPlanPrice(amount);
        appStatistics.setSubcriptionTimeOfExpiration(subscriptionPlanService.getSubscriptionPlanByPrice(amount).getTimeOfExpiration());
        appStatisticsRepository.save(appStatistics);

        transaction.put("status", HttpStatus.OK.value());
        return transaction;
    }

    // Tạo cửa hàng mới
    @Transactional
    public StoreResponse createNewStore(StoreRequest request, String transactionNo, String username) {
        // Kiểm tra transactionNo trong app_statistics
        Optional<AppStatistics> optionalAppStatistics = appStatisticsRepository.findByTransactionNo(transactionNo);

        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại."));

        if (optionalAppStatistics.isEmpty()) {
            throw new IllegalArgumentException("TransactionNo không hợp lệ hoặc không tồn tại.");
        }

        AppStatistics appStatistics = optionalAppStatistics.get();

        // Kiểm tra điều kiện trước khi tạo cửa hàng
        if (appStatistics.getStore() != null) {
            throw new IllegalArgumentException("Giao dịch này đã được xử lý.");
        }

        if (!username.equals(appStatistics.getCreatedBy())) {
            throw new IllegalArgumentException("Người thực hiện không hợp lệ.");
        }

        // Tính expireAt dựa vào subscriptionTimeOfExpiration
        Integer subscriptionTime = appStatistics.getSubcriptionTimeOfExpiration();
        LocalDateTime expireAt = (subscriptionTime != null) ? LocalDateTime.now().plusMonths(subscriptionTime) : null;

        SubscriptionPlan subscriptionPlan = subscriptionPlanService.getSubscriptionPlanByPrice(appStatistics.getSubcriptionPlanPrice());

        // Tạo mới cửa hàng
        Store newStore = new Store();
        newStore.setStoreName(request.getStoreName());
        newStore.setAddress(request.getAddress());
        newStore.setHotline(request.getHotline());
        newStore.setDescription(request.getDescription());
        newStore.setOperatingHour(request.getOperatingHour());
        newStore.setExpireAt(expireAt);
        newStore.setStoreAccount(account);
        newStore.setImage(request.getImage());
        newStore.setSubscriptionPlan(subscriptionPlan);

        // Lưu cửa hàng vào DB
        Store savedStore = storeRepository.save(newStore);

        // Cập nhật storeid vào app_statistics
        appStatistics.setStore(newStore);
        appStatisticsRepository.save(appStatistics);

        return StoreResponse.builder()
                .storeID(savedStore.getId())
                .storeName(savedStore.getStoreName())
                .address(savedStore.getAddress())
                .hotline(savedStore.getHotline())
                .description(savedStore.getDescription())
                .operatingHour(savedStore.getOperatingHour())
                .expireAt(savedStore.getExpireAt())
                .image(savedStore.getImage())
                .build();
    }
}