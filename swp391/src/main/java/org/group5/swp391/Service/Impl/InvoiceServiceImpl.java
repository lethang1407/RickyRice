package org.group5.swp391.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.Converter.InvoiceConverter;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreInvoiceDTO;
import org.group5.swp391.Entity.Account;
import org.group5.swp391.Entity.Customer;
import org.group5.swp391.Entity.Invoice;
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

import java.util.ArrayList;
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
        List<Customer> customers = customerRepository.findByPhoneNumberContainingIgnoreCase(phoneNumber);
        if ((phoneNumber == null || phoneNumber.isEmpty()) && typeStr.equals("all") && statusStr.equals("all")) {
            return invoiceRepository.findByStoreIn(stores, pageable).map(invoiceConverter::toStoreInvoiceDTO);
        }
        boolean type = typeStr.equals("export");
        boolean status = statusStr.equals("paid");
        return invoiceRepository.findByStoreInAndCustomerInAndTypeAndStatus(stores, customers, type, status, pageable).map(invoiceConverter::toStoreInvoiceDTO);    }
}