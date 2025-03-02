package org.group5.swp391.service;

import org.group5.swp391.dto.store_owner.StoreInvoiceDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface InvoiceService {
    public Page<StoreInvoiceDTO> getInvoices(String phoneNumber, int page, int size, String sortBy, boolean descending, String typeStr, String statusStr);

}