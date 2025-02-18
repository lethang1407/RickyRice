package org.group5.swp391.Service;

import org.group5.swp391.DTO.StoreOwnerDTO.StoreInvoiceDetailDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface InvoiceDetailService {
    public List<StoreInvoiceDetailDTO> getInvoiceDetailsByInvoice(String invoiceId);
}
