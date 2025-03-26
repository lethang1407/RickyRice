package org.group5.swp391.service;

import org.group5.swp391.dto.employee.InvoiceRequest.InvoiceDetailDTO;
import org.group5.swp391.dto.store_owner.all_invoice.StoreInvoiceDetailDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface InvoiceDetailService {
    public List<StoreInvoiceDetailDTO> getInvoiceDetailsByInvoice(String invoiceId);
    public List<InvoiceDetailDTO>   getInvoiceDetailsByInvoiceId(String invoiceId);
}
