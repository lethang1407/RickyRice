package org.group5.swp391.service.impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.response.AdminResponse.AppStatisticsResponse;
import org.group5.swp391.entity.AppStatistics;
import org.group5.swp391.repository.AppStatisticsRepository;
import org.group5.swp391.service.AppStatisticsService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppStatisticsServiceServiceImpl implements AppStatisticsService {

    private final AppStatisticsRepository appStatisticsRepository;

    // lấy danh sách giao dịch các gói dịch vụ của trang web
    public List<AppStatisticsResponse> getStatistics() {
        List<AppStatistics> statistics = appStatisticsRepository.findAll();
        return statistics.stream()
                .map(stat -> AppStatisticsResponse.builder()
                        .appStatisticsID(stat.getId())
                        .storeID(stat.getStore() != null ? stat.getStore().getId() : null)
                        .subcriptionPlanName(stat.getSubcriptionPlanName())
                        .subcriptionPlanPrice(stat.getSubcriptionPlanPrice())
                        .subcriptionDescription(stat.getSubcriptionDescription())
                        .subcriptionTimeOfExpiration(stat.getSubcriptionTimeOfExpiration())
                        .createdAt(stat.getCreatedAt())
                        .createdBy(stat.getCreatedBy())
                        .transactionNo(stat.getTransactionNo())
                        .build())
                .collect(Collectors.toList());
    }


    // lấy danh sách giao dich có StoreID null
    public List<String> getTransactionNosWithNullStore() {
        return appStatisticsRepository.findTransactionNosWithNullStore();
    }
}
