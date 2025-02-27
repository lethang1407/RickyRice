package org.group5.swp391.converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.store_owner.StoreInvoiceDetailDTO;
import org.group5.swp391.entity.InvoiceDetail;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InvoiceDetailConverter {
    private final ModelMapper modelMapper;

    public StoreInvoiceDetailDTO toStoreInvoiceDetailDTO(InvoiceDetail invoiceDetail) {
        return modelMapper.map(invoiceDetail, StoreInvoiceDetailDTO.class);
    }
}
