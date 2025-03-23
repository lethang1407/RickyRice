package org.group5.swp391.converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.store_owner.all_statistic.StoreStatisticDTO;
import org.group5.swp391.dto.store_owner.all_statistic.StoreStatisticDataDTO;
import org.group5.swp391.entity.Statistics;
import org.group5.swp391.repository.AccountRepository;
import org.group5.swp391.repository.EmployeeRepository;
import org.group5.swp391.repository.ProductRepository;
import org.group5.swp391.repository.StatisticsRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StatisticsConverter {

    private final ModelMapper modelMapper;
    private final AccountRepository accountRepository;
    private final EmployeeRepository employeeRepository;
    private final ProductRepository productRepository;
    private final StatisticsRepository statisticsRepository;

    public StoreStatisticDTO toStoreStatisticDTO(Statistics statistics) {
        if (statistics == null || statistics.getStore() == null) {
            return null;
        }
        StoreStatisticDTO dto = modelMapper.map(statistics, StoreStatisticDTO.class);
        dto.setStoreID(statistics.getStore().getId());
        dto.setStoreName(statistics.getStore().getStoreName());
        return dto;
    }
}