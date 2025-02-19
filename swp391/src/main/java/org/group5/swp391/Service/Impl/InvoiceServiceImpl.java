package org.group5.swp391.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.Converter.InvoiceConverter;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreInvoiceDTO;
import org.group5.swp391.Entity.Account;
import org.group5.swp391.Entity.Customer;
import org.group5.swp391.Entity.Store;
import org.group5.swp391.Repository.AccountRepository;
import org.group5.swp391.Repository.CustomerRepository;
import org.group5.swp391.Repository.InvoiceRepository;
import org.group5.swp391.Repository.StoreRepository;
import org.group5.swp391.Service.InvoiceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final InvoiceConverter invoiceConverter;
    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;
    private final StoreRepository storeRepository;

    @Override
    public Page<StoreInvoiceDTO> getInvoices(String phoneNumber, int page, int size, String sortBy, boolean descending) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username).orElseThrow(null);
        List<Store> stores = storeRepository.findByStoreAccount(account);
        List<Customer> customers = customerRepository.findByPhoneNumberContainingIgnoreCase(phoneNumber);

        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            return invoiceRepository.findAll(pageable).map(invoiceConverter::toStoreInvoiceDTO);
        }
        return invoiceRepository.findByStoreInAndCustomerIn(stores, customers, pageable).map(invoiceConverter::toStoreInvoiceDTO);
    }
}