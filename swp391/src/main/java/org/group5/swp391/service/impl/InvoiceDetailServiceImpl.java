package org.group5.swp391.service.impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.InvoiceDetailConverter;
import org.group5.swp391.dto.store_owner.StoreInvoiceDetailDTO;
import org.group5.swp391.entity.Invoice;
import org.group5.swp391.repository.InvoiceDetailRepository;
import org.group5.swp391.repository.InvoiceRepository;
import org.group5.swp391.service.InvoiceDetailService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceDetailServiceImpl implements InvoiceDetailService {
    private final InvoiceDetailRepository invoiceDetailRepository;
    private final InvoiceDetailConverter invoiceDetailConverter;
    private final InvoiceRepository invoiceRepository;

    @Override
    public List<StoreInvoiceDetailDTO> getInvoiceDetailsByInvoice(String invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId).orElse(null);
        return invoiceDetailRepository.findByInvoice(invoice)
                .stream()
                .map(invoiceDetailConverter::toStoreInvoiceDetailDTO)
                .collect(Collectors.toList());
    }
}
