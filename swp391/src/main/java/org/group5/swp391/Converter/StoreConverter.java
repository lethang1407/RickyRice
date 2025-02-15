package org.group5.swp391.Converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreInfoDTO;
import org.group5.swp391.Entity.Store;
import org.group5.swp391.Repository.InvoiceRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StoreConverter {
    private final ModelMapper modelMapper;
    private final InvoiceRepository invoiceRepository;

    public StoreInfoDTO toStoreDTO(Store store){
        return modelMapper.map(store, StoreInfoDTO.class);
    }
}