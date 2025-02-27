package org.group5.swp391.service;

import org.group5.swp391.dto.store_owner.StoreStatisticDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface StatisticsService {
    public Page<StoreStatisticDTO> getStatistics(String storeName,int page, int size, String sortBy, boolean descending);
}
