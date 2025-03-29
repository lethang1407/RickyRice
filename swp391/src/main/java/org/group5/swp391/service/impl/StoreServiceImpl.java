package org.group5.swp391.service.impl;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.StoreConverter;
import org.group5.swp391.dto.request.store_request.StoreRequest;
import org.group5.swp391.dto.response.AdminResponse.ViewStoreResponse;
import org.group5.swp391.dto.response.store_response.StoreResponse;
import org.group5.swp391.dto.store_owner.all_product.StoreInfoIdAndNameDTO;
import org.group5.swp391.dto.store_owner.all_store.StoreInfoDTO;
import org.group5.swp391.entity.*;
import org.group5.swp391.exception.AppException;
import org.group5.swp391.exception.ErrorCode;
import org.group5.swp391.repository.*;
import org.group5.swp391.service.StoreService;
import org.group5.swp391.service.SubscriptionPlanService;
import org.group5.swp391.service.VNPayService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.util.*;
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

    // lấy danh sách tất cả cửa hàng của hệ thống
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
        if(account.getEmployee()!=null){
            storeList.add(account.getEmployee().getStore());
        }
        return storeList.stream().map(
                        item -> StoreInfoDTO.builder()
                                .storeID(item.getId())
                                .storeName(item.getStoreName())
                                .build())
                .toList();
    }

    public List<StoreInfoIdAndNameDTO> getStoresInfoIdAndName(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String username = authentication.getName();
        List<Store> list = storeRepository.findByUserName(username);
        return list.stream().map(storeConverter::toStoreInfoIdAndNameDTO).toList();
    }

    // xử lí dữ liệu trả về để tạo cửa hàng mới
    @Transactional
    public String paymentCreateStore(String username, String vnp_TransactionNo, double amount) {

        NumberFormat nf = NumberFormat.getInstance(new Locale("vi", "VN"));
        String message = "Bạn đã thanh toán " + nf.format(amount) + " thành công.";

        // Tạo thông báo thanh toán thành công
        Notification notification = new Notification();
        Account account = accountRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        notification.setTargetAccount(account);
        notification.setCreatedBy("System");
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

        return message;
    }

    // tạo cửa hàng mới
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

        // Tạo thông báo thanh toán thành công
        Notification notification = new Notification();
        notification.setTargetAccount(account);
        notification.setCreatedBy("System");
        notification.setIsRead(false);
        notification.setMessage("Tạo cửa hàng thành công.");
        notificationRepository.save(notification);

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

    // cập nhật thời hạn cho cửa hàng
    @Transactional
    public String updateStoreExpiration(String username, String storeID, double amount, String vnp_TransactionNo) {

        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại."));

        if (storeID == null) {
            throw new IllegalArgumentException("Không tìm thấy storeID trong vnp_OrderInfo.");
        }

        // Tìm cửa hàng theo storeID
        Store store = storeRepository.findById(storeID)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        // Kiểm tra cửa hàng có thuộc người dùng không
        if (!store.getStoreAccount().equals(account)) {
            throw new IllegalArgumentException("Cửa hàng không thuộc quyền sở hữu của người dùng.");
        }

        // Lấy thông tin gói đăng ký của cửa hàng
        SubscriptionPlan subscriptionPlan = subscriptionPlanService.getSubscriptionPlanByPrice(amount);
        if (subscriptionPlan == null) {
            throw new IllegalArgumentException("Gói đăng ký không phù hợp.");
        }

        // Cập nhật expire_at dựa trên thời gian hết hạn của gói đăng ký
        Integer subscriptionTime = subscriptionPlan.getTimeOfExpiration();
        if (subscriptionTime == null) {
            throw new IllegalArgumentException("Thời hạn gói đăng ký không hợp lệ.");
        }

        // Lấy thời gian hết hạn hiện tại từ database
        LocalDateTime currentExpireAt = store.getExpireAt();
        LocalDateTime newExpireAt;

        // Kiểm tra nếu cửa hàng vẫn còn hạn thì cộng thêm vào, nếu đã hết hạn thì bắt đầu từ thời điểm hiện tại
        if (currentExpireAt != null && currentExpireAt.isAfter(LocalDateTime.now())) {
            newExpireAt = currentExpireAt.plusMonths(subscriptionTime);
        } else {
            newExpireAt = LocalDateTime.now().plusMonths(subscriptionTime);
        }

        store.setExpireAt(newExpireAt);
        storeRepository.save(store);

        String message = "Cập nhật ngày hết hạn thành công cho cửa hàng " + store.getStoreName();

        // Tạo thông báo thanh toán thành công
        Notification notification = new Notification();
        notification.setTargetAccount(account);
        notification.setCreatedBy("System");
        notification.setIsRead(false);
        notification.setMessage(message);
        notificationRepository.save(notification);

        // Lưu lịch sử giao dịch
        AppStatistics appStatistics = new AppStatistics();
        appStatistics.setTransactionNo(vnp_TransactionNo);
        appStatistics.setSubcriptionDescription(message);
        appStatistics.setSubcriptionPlanName(subscriptionPlanService.getSubscriptionPlanByPrice(amount).getName());
        appStatistics.setSubcriptionPlanPrice(amount);
        appStatistics.setSubcriptionTimeOfExpiration(subscriptionPlanService.getSubscriptionPlanByPrice(amount).getTimeOfExpiration());
        appStatistics.setStore(store);
        appStatisticsRepository.save(appStatistics);

        return message;
    }

    // xử lí cập nhật thời hạn hoặc tạo mới cửa hàng
    @Transactional
    public String handlePayment(String username, String vnp_TxnRef, String vnp_TransDate, HttpServletRequest req) {
        // Gọi VNPay API để lấy thông tin giao dịch
        Map<String, Object> transaction = vnPayService.queryPayment(vnp_TxnRef, vnp_TransDate, req);

        // Kiểm tra nếu VNPay trả về lỗi
        if (transaction.containsKey("error")) {
            transaction.put("status", HttpStatus.BAD_REQUEST.value());
            transaction.put("message", "Không lấy được lịch sử thanh toán: " + transaction.get("error"));
            return "Không lấy được lịch sử thanh toán: " + transaction.get("error");
        }

        // Kiểm tra vnp_ResponseCode (chỉ xử lý nếu == "00")
        String vnp_ResponseCode = (String) transaction.get("vnp_ResponseCode");
        if (!"00".equals(vnp_ResponseCode)) {
            transaction.put("status", HttpStatus.BAD_REQUEST.value());
            transaction.put("message", "vnp_ResponseCode: " + vnp_ResponseCode);
            return "vnp_ResponseCode: " + vnp_ResponseCode;
        }

        String vnp_TransactionStatus = (String) transaction.get("vnp_TransactionStatus");
        if (!"00".equals(vnp_TransactionStatus)) {
            transaction.put("status", HttpStatus.BAD_REQUEST.value());
            transaction.put("message", "vnp_TransactionStatus: " + vnp_TransactionStatus);
            return "Giao dịch chưa hoàn tất";
        }
        if ("00".equals(vnp_ResponseCode) && "00".equals(vnp_TransactionStatus)) {
            // Trích xuất thông tin cần thiết
            String vnp_OrderInfo = (String) transaction.get("vnp_OrderInfo");
            String vnp_TransactionNo = (String) transaction.get("vnp_TransactionNo");
            String vnp_Amount = (String) transaction.get("vnp_Amount");
            double amount = Double.parseDouble(vnp_Amount) / 100;

            // Kiểm tra nếu giao dịch đã tồn tại trong appStatistics
            if (appStatisticsRepository.existsByTransactionNo(vnp_TransactionNo)) {
                transaction.put("status", HttpStatus.OK.value());
                transaction.put("message", "Giao dịch đã được ghi nhận.");
                return "Giao dịch đã được ghi nhận.";
            }

            // Kiểm tra xem vnp_OrderInfo có chứa Store ID không
            String storeID = extractStoreID(vnp_OrderInfo);
            if (storeID == null) {
                return paymentCreateStore(username, vnp_TransactionNo, amount);
            } else {
                return updateStoreExpiration(username, storeID, amount, vnp_TransactionNo);
            }
        } else {
            return "Lỗi giao dịch." + "vnp_ResponseCode: " + vnp_ResponseCode + "vnp_TransactionStatus: " + vnp_TransactionStatus;
        }

    }

    // trích xuất Store ID từ vnp_OrderInfo
    private String extractStoreID(String vnp_OrderInfo) {
        if (vnp_OrderInfo == null || !vnp_OrderInfo.contains("ID:")) {
            return null;
        }
        return vnp_OrderInfo.replaceAll(".*ID:\\s*", "").trim();
    }

    // cập nhật thông tin cửa hàng
    public StoreResponse updateStoreInfor(String storeID, StoreRequest request, String username) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại."));
        if (storeID == null) {
            throw new IllegalArgumentException("Không tìm thấy storeID");
        }
        Store store = storeRepository.findById(storeID)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (!store.getStoreAccount().equals(account)) {
            throw new IllegalArgumentException("Cửa hàng không thuộc quyền sở hữu của người dùng.");
        }

        store.setStoreName(request.getStoreName());
        store.setAddress(request.getAddress());
        store.setHotline(request.getHotline());
        store.setOperatingHour(request.getOperatingHour());
        store.setDescription(request.getDescription());
        store.setImage(request.getImage());

        Store updateStore = storeRepository.save(store);

        return StoreResponse.builder()
                .storeID(updateStore.getId())
                .storeName(updateStore.getStoreName())
                .address(updateStore.getAddress())
                .hotline(updateStore.getHotline())
                .operatingHour(updateStore.getOperatingHour())
                .description(updateStore.getDescription())
                .image(updateStore.getImage())
                .expireAt(updateStore.getExpireAt())
                .build();
    }

    // lấy danh sách những yêu cầu tạo cửa hàng mới
    public List<Map<String, Object>> getRequestCreateStores(String username) {
        List<Object[]> results = appStatisticsRepository.findTransactionAndExpirationWithNullStoreAndCreatedBy(username);
        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("transactionNo", row[0]);
            map.put("subcriptionTimeOfExpiration", row[1]);
            response.add(map);
        }
        return response;
    }

    // lấy thông tin store theo ID
    public StoreResponse getStoreById(String storeID, String username) {
        Store store = storeRepository.findByIdAndStoreAccount_Username(storeID, username)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        return StoreResponse.builder()
                .storeID(store.getId())
                .storeName(store.getStoreName())
                .address(store.getAddress())
                .hotline(store.getHotline())
                .operatingHour(store.getOperatingHour())
                .description(store.getDescription())
                .image(store.getImage())
                .expireAt(store.getExpireAt())
                .build();
    }

    // lấy danh sách tất cả cửa hàng của hệ thống (phân trang, tìm kiếm, sắp xếp)
    public Map<String, Object> getStoreStatistics(String keyword, String subscriptionPlanName, String sortBy, String sortDirection, int page, int size) {
        Sort sort = switch (sortBy) {
            case "expireAt" -> Sort.by(Sort.Direction.fromString(sortDirection), "expireAt");
            case "createdAt" -> Sort.by(Sort.Direction.fromString(sortDirection), "createdAt");
            case "updatedAt" -> Sort.by(Sort.Direction.fromString(sortDirection), "updatedAt");
            case "subscriptionPlanPrice" -> Sort.by(Sort.Direction.fromString(sortDirection), "subscriptionPlan.price");
            default -> Sort.by(Sort.Direction.fromString(sortDirection), "createdAt");
        };

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ViewStoreResponse> stores = storeRepository.searchStores(keyword, subscriptionPlanName, pageable).map(store ->
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
                        .subscriptionPlanName(store.getSubscriptionPlan().getName())
                        .subscriptionPlanPrice(store.getSubscriptionPlan().getPrice())
                        .subscriptionTimeOfExpiration(store.getSubscriptionPlan().getTimeOfExpiration())
                        .createdAt(store.getCreatedAt())
                        .updateAt(store.getUpdatedAt())
                        .build()
        );

        List<String> subscriptionPlans = storeRepository.findAllSubscriptionPlanNames();
        long totalStores = storeRepository.countTotalStores();

        return Map.of(
                "stores", stores,
                "subscriptionPlans", subscriptionPlans,
                "totalStores", totalStores
        );
    }

}