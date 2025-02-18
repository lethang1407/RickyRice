package org.group5.swp391.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.Converter.InvoiceConverter;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreInvoiceDTO;
import org.group5.swp391.Repository.CustomerRepository;
import org.group5.swp391.Repository.InvoiceRepository;
import org.group5.swp391.Service.InvoiceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final InvoiceConverter invoiceConverter;
    private final CustomerRepository customerRepository;

    @Override
    public Page<StoreInvoiceDTO> getInvoices(String phoneNumber, int page, int size, String sortBy, boolean descending) {
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            return invoiceRepository.findAll(pageable).map(invoiceConverter::toStoreInvoiceDTO);
        }
        return invoiceRepository.findByCustomerIn(customerRepository.findByPhoneNumberContainingIgnoreCase(phoneNumber), pageable).map(invoiceConverter::toStoreInvoiceDTO);
    }
}