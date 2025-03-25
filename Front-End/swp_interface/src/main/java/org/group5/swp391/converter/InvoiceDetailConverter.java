package org.group5.swp391.converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.employee.InvoiceRequest.InvoiceDTO;
import org.group5.swp391.dto.employee.InvoiceRequest.InvoiceDetailDTO;
import org.group5.swp391.dto.store_owner.all_invoice.StoreInvoiceDetailDTO;
import org.group5.swp391.entity.InvoiceDetail;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InvoiceDetailConverter {
    private final ModelMapper modelMapper;

    public StoreInvoiceDetailDTO toStoreInvoiceDetailDTO(InvoiceDetail invoiceDetail) {
        StoreInvoiceDetailDTO storeEmployeeDTO = modelMapper.map(invoiceDetail, StoreInvoiceDetailDTO.class);
        storeEmployeeDTO.setInvoiceDetailID(invoiceDetail.getId());
        return storeEmployeeDTO;
    }
    public InvoiceDetailDTO toEmployeeInvoiceDetailDTO(InvoiceDetail invoiceDetail) {
        InvoiceDetailDTO invoiceDetailDTO = modelMapper.map(invoiceDetail, InvoiceDetailDTO.class);
        invoiceDetailDTO.setId(invoiceDetail.getId());
        return invoiceDetailDTO;
    }
}
