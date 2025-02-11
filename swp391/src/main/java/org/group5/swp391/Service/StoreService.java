package org.group5.swp391.Service;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.Response.ViewStoreResponse;
import org.group5.swp391.Repository.StoreRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreRepository storeRepository;

    // lấy danh sách tất cả các cửa hàng
    public List<ViewStoreResponse> getAllStores() {
        return storeRepository.findAll().stream().map(store ->
                ViewStoreResponse.builder()
                        .storeID(store.getStoreID())
                        .storeName(store.getStoreName())
                        .address(store.getAddress())
                        .hotline(store.getHotline())
                        .description(store.getDescription())
                        .operatingHour(store.getOperatingHour())
                        .expireAt(store.getExpireAt())
                        .image(store.getImage())
                        .accountName(store.getStoreAccount().getUsername())
                        .subscriptionPlanID(store.getSubscriptionPlan().getSubscriptionPlanID())
                        .createdAt(store.getCreatedAt())
                        .updateAt(store.getUpdatedAt())
                        .subscriptionPlanName(store.getSubscriptionPlan().getName())
                        .subscriptionPlanPrice(store.getSubscriptionPlan().getPrice())
                        .subscriptionTimeOfExpiration(store.getSubscriptionPlan().getTimeOfExpiration())
                        .build()
        ).collect(Collectors.toList());
    }
}
