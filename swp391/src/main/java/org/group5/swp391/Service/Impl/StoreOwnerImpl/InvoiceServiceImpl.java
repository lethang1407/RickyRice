package org.group5.swp391.Service.Impl.StoreOwnerImpl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.Converter.StoreOwner.InvoiceConverter;
import org.group5.swp391.DTO.StoreOwnerDTO.InvoiceDTO;
import org.group5.swp391.Repository.StoreOwnerRepository.CustomerRepository;
import org.group5.swp391.Repository.StoreOwnerRepository.InvoiceRepository;
import org.group5.swp391.Service.StoreOwnerService.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Page<InvoiceDTO> getInvoices(int page, int size, String sortBy, boolean descending) {
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return invoiceRepository.findAll(pageable).map(invoiceConverter::toInvoiceDTO);
    }
    @Override
    public Page<InvoiceDTO> searchInvoices(String phoneNumber, int page, int size, String sortBy, boolean descending) {
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return invoiceRepository.findByCustomerIn(customerRepository.findByPhoneNumberContainingIgnoreCase(phoneNumber), pageable).map(invoiceConverter::toInvoiceDTO);
    }
}