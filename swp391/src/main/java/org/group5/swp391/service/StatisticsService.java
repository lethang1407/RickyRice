package org.group5.swp391.service;

import org.group5.swp391.dto.store_owner.all_statistic.StoreStatisticDTO;
import org.group5.swp391.dto.store_owner.all_statistic.StoreStatisticDataDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public interface StatisticsService {
    public Page<StoreStatisticDTO> getStatistics(List<String> store, Double totalMoneyMin, Double totalMoneyMax,
                                                 String type, LocalDate createdAtStart,
                                                 LocalDate createdAtEnd, String createdBy, int page, int size,
                                                 String sortBy, boolean descending);

    public Map<String, Map<String, Double>> getStatisticsByType(LocalDate createdAtStart, LocalDate createdAtEnd, List<String> storeIds);

    public StoreStatisticDataDTO getStatisticTransactionsByStores(List<String> storeIds);

    public Map<String, Double> getStatisticByDebt(LocalDate createdAtStart, LocalDate createdAtEnd, List<String> storeIds);
}