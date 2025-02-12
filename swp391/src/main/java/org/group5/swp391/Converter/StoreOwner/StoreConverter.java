package org.group5.swp391.Converter.StoreOwner;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreDTO;
import org.group5.swp391.Entity.Store;
import org.group5.swp391.Repository.StoreOwnerRepository.InvoiceRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StoreConverter {
    private final ModelMapper modelMapper;
    private final InvoiceRepository invoiceRepository;

    public StoreDTO toStoreDTO(Store store){
        return modelMapper.map(store, StoreDTO.class);
    }
}