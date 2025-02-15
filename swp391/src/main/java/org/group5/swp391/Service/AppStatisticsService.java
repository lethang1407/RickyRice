package org.group5.swp391.Service;

import org.group5.swp391.DTO.Response.AdminResponse.AppStatisticsResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AppStatisticsService {
    public List<AppStatisticsResponse> getStatistics();
}
