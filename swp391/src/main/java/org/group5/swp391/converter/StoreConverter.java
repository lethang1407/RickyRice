package org.group5.swp391.converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.store_owner.StoreInfoDTO;
import org.group5.swp391.entity.Store;
import org.group5.swp391.repository.InvoiceRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StoreConverter {
    private final ModelMapper modelMapper;
    private final InvoiceRepository invoiceRepository;

    public StoreInfoDTO toStoreDTO(Store store){
        StoreInfoDTO dto = modelMapper.map(store, StoreInfoDTO.class);
        dto.setStoreID(store.getId());
        return dto;
    }
}