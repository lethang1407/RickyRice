package org.group5.swp391.Service;

import org.group5.swp391.DTO.StoreOwnerDTO.StoreStatisticDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface StatisticsService {
    public Page<StoreStatisticDTO> getStatistics(String storeName,int page, int size, String sortBy, boolean descending);
}
