package org.group5.swp391.service.impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.response.AdminResponse.AppStatisticsResponse;
import org.group5.swp391.entity.AppStatistics;
import org.group5.swp391.repository.AppStatisticsRepository;
import org.group5.swp391.service.AppStatisticsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppStatisticsServiceImpl implements AppStatisticsService {

    private final AppStatisticsRepository appStatisticsRepository;

    // lấy danh sách giao dịch các gói dịch vụ của trang web (phần trang, lọc, sắp xếp, tìm kiếm)
    @Override
    public Page<AppStatisticsResponse> getStatistics(int page, int size, String sortBy, String sortDirection,
                                                     String subscriptionPlanName, String searchQuery) {
        Sort sort = sortDirection.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<AppStatistics> statistics = appStatisticsRepository.findAllWithFilters(
                subscriptionPlanName, searchQuery, pageable);
        System.out.println(statistics.getContent().get(0).getSubcriptionPlanName());
        return statistics.map(stat -> AppStatisticsResponse.builder()
                .appStatisticsID(stat.getId())
                .storeID(stat.getStore() != null ? stat.getStore().getId() : null)
                .subcriptionPlanName(stat.getSubcriptionPlanName())
                .subcriptionPlanPrice(stat.getSubcriptionPlanPrice())
                .subcriptionDescription(stat.getSubcriptionDescription())
                .subcriptionTimeOfExpiration(stat.getSubcriptionTimeOfExpiration())
                .createdAt(stat.getCreatedAt())
                .createdBy(stat.getCreatedBy())
                .transactionNo(stat.getTransactionNo())
                .build());
    }

    // Lấy danh sách tất cả Subscription Plan Name (không trùng lặp)
    @Override
    public List<String> getAllSubscriptionPlanNames() {
        return appStatisticsRepository.findDistinctSubscriptionPlanNames();
    }

    // Tính tổng doanh thu của tất cả giao dịch
    @Override
    public Double calculateTotalRevenue() {
        return appStatisticsRepository.calculateTotalRevenue();
    }

    // lấy danh sách các gói đăng kí theo username
    public List<String> getSubscriptionPlansByUsername(String username) {
        return appStatisticsRepository.findSubscriptionNamesByCreatedBy(username);
    }
}
