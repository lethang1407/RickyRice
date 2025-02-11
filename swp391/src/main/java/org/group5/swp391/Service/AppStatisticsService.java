package org.group5.swp391.Service;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.Response.AppStatisticsResponse;
import org.group5.swp391.Entity.AppStatistics;
import org.group5.swp391.Repository.AppStatisticsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppStatisticsService {

    private final AppStatisticsRepository appStatisticsRepository;

    // lấy danh sách giao dịch các gói dịch vụ của trang web
    public List<AppStatisticsResponse> getStatistics() {
        List<AppStatistics> statistics = appStatisticsRepository.findAll();
        return statistics.stream()
                .map(stat -> AppStatisticsResponse.builder()
                        .appStatisticsID(stat.getAppStatisticsID())
                        .storeID(stat.getStore().getStoreID())
                        .storeName(stat.getStore().getStoreName())
                        .subcriptionPlanName(stat.getSubcriptionPlanName())
                        .subcriptionPlanPrice(stat.getSubcriptionPlanPrice())
                        .subcriptionDescription(stat.getSubcriptionDescription())
                        .subcriptionTimeOfExpiration(stat.getSubcriptionTimeOfExpiration())
                        .createdAt(stat.getCreatedAt())
                        .createdBy(stat.getCreatedBy())
                        .build())
                .collect(Collectors.toList());
    }
}
