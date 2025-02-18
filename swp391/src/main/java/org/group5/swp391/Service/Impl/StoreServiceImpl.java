package org.group5.swp391.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.Converter.StoreConverter;
import org.group5.swp391.DTO.Response.AdminResponse.ViewStoreResponse;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreInfoDTO;
import org.group5.swp391.Entity.Account;
import org.group5.swp391.Repository.AccountRepository;
import org.group5.swp391.Repository.StoreRepository;
import org.group5.swp391.Service.StoreService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class StoreServiceImpl implements StoreService {
    private final StoreRepository storeRepository;
    private final StoreConverter storeConverter;
    private final AccountRepository accountRepository;

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