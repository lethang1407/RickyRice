package org.group5.swp391.service.impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.InvoiceConverter;
import org.group5.swp391.dto.store_owner.all_invoice.StoreInvoiceDTO;
import org.group5.swp391.entity.Account;
import org.group5.swp391.entity.Customer;
import org.group5.swp391.entity.Store;
import org.group5.swp391.repository.AccountRepository;
import org.group5.swp391.repository.CustomerRepository;
import org.group5.swp391.repository.InvoiceRepository;
import org.group5.swp391.repository.StoreRepository;
import org.group5.swp391.service.InvoiceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.server.ResponseStatusException;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final InvoiceConverter invoiceConverter;
    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;
    private final StoreRepository storeRepository;

    @Override
    public Page<StoreInvoiceDTO> getInvoices(
            String phoneNumber,
            int page,
            int size,
            String sortBy,
            boolean descending,
            String typeStr,
            String statusStr) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Tài khoản không tồn tại"));
        List<Store> stores = storeRepository.findByStoreAccount(account);
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        if ((phoneNumber == null || phoneNumber.isEmpty()) && typeStr.equals("all") && statusStr.equals("all")) {
            return invoiceRepository.findByStoreIn(stores, pageable).map(invoiceConverter::toStoreInvoiceDTO);
        }
        List<Customer> customers = customerRepository.findByPhoneNumberContainingIgnoreCase(phoneNumber);
        Boolean type = typeStr.equals("all") ? null : typeStr.equals("export");
        Boolean status = statusStr.equals("all") ? null : statusStr.equals("paid");
        return invoiceRepository.findInvoices(stores, customers, type, status, pageable).map(invoiceConverter::toStoreInvoiceDTO);    }
}