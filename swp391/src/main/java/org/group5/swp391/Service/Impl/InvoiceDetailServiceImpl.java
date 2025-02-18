package org.group5.swp391.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.Converter.InvoiceDetailConverter;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreInvoiceDetailDTO;
import org.group5.swp391.Entity.Invoice;
import org.group5.swp391.Repository.InvoiceDetailRepository;
import org.group5.swp391.Repository.InvoiceRepository;
import org.group5.swp391.Service.InvoiceDetailService;
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
