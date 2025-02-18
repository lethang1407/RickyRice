package org.group5.swp391.Service;

import org.group5.swp391.DTO.StoreOwnerDTO.StoreInvoiceDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface InvoiceService {
    public Page<StoreInvoiceDTO> getInvoices(String phoneNumber, int page, int size, String sortBy, boolean descending);

}