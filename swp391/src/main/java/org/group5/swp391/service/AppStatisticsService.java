package org.group5.swp391.service;

import org.group5.swp391.dto.response.AdminResponse.AppStatisticsResponse;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AppStatisticsService {
    public List<AppStatisticsResponse> getStatistics();

    // ========================================================
    Page<AppStatisticsResponse> getStatistics(int page, int size, String sortBy, String sortDirection,
                                              String subscriptionPlanName, String searchQuery);

    List<String> getAllSubscriptionPlanNames();
    Double calculateTotalRevenue();
}
