package org.group5.swp391.service;

import org.group5.swp391.dto.response.AdminResponse.AppStatisticsResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AppStatisticsService {
    public List<AppStatisticsResponse> getStatistics();
}
