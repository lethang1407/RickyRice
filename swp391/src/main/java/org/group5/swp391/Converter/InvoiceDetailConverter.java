package org.group5.swp391.Converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreInvoiceDetailDTO;
import org.group5.swp391.Entity.InvoiceDetail;
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
