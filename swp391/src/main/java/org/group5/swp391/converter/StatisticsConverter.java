package org.group5.swp391.converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.store_owner.StoreStatisticDTO;
import org.group5.swp391.entity.Statistics;
import org.group5.swp391.repository.AccountRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

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
        dto.setStoreID(statistics.getStore().getId());
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