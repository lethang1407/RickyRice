package org.group5.swp391.service;

import org.group5.swp391.dto.employee.InvoiceRequest.InvoiceDTO;
import org.group5.swp391.dto.employee.InvoiceRequest.InvoiceRequest;
import org.group5.swp391.dto.store_owner.all_invoice.StoreInvoiceDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface InvoiceService {
    public Page<StoreInvoiceDTO> getInvoices(String phoneNumber, int page, int size, String sortBy, boolean descending, String typeStr, String statusStr);
    public void CreateInvoice(InvoiceRequest invoiceRequest);
    public Page<InvoiceDTO>getInvoicesForEmployee(String phoneNumber, int page, int size, String sortBy, boolean descending);
}