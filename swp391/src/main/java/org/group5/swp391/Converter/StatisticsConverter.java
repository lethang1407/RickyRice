package org.group5.swp391.Converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreStatisticDTO;
import org.group5.swp391.Entity.Statistics;
import org.group5.swp391.Repository.AccountRepository;
import org.group5.swp391.Repository.StatisticsRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class StatisticsConverter {

    private final ModelMapper modelMapper;
    private final AccountRepository accountRepository;

    public StoreStatisticDTO toStoreStatisticDTO(Statistics statistics) {
        if (statistics == null || statistics.getStore() == null) {
            return null;
        }
        StoreStatisticDTO dto = modelMapper.map(statistics, StoreStatisticDTO.class);
        dto.setStoreID(statistics.getStore().getStoreID());
        dto.setStoreName(statistics.getStore().getStoreName());
        String createdById = statistics.getCreatedBy();
        accountRepository.findById(createdById)
                .ifPresentOrElse(
                        account -> dto.setCreatedBy(account.getUsername()),
                        () -> dto.setCreatedBy("Unknown")
                );
        return dto;
    }
}