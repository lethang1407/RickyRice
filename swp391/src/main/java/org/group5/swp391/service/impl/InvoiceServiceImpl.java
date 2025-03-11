package org.group5.swp391.service.impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.InvoiceConverter;
import org.group5.swp391.dto.employee.InvoiceRequest.InvoiceDTO;
import org.group5.swp391.dto.employee.InvoiceRequest.InvoiceDetailDTO;
import org.group5.swp391.dto.employee.InvoiceRequest.InvoiceRequest;
import org.group5.swp391.dto.store_owner.all_invoice.StoreInvoiceDTO;
import org.group5.swp391.entity.*;
import org.group5.swp391.entity.Package;
import org.group5.swp391.repository.*;
import org.group5.swp391.service.InvoiceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;
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
    private final EmployeeRepository employeeRepository;
    private final PackageRepository packageRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

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

    @Override
    @Transactional
    public void CreateInvoice(InvoiceRequest invoiceRequest) {
        String username = invoiceRequest.getEmployeeUsername();
        System.out.println(invoiceRequest.getEmployeeUsername());
        if (username == null) {
            throw new IllegalArgumentException("Không có thông tin nhân viên trong yêu cầu!");
        }

        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Tài khoản không tồn tại"));
        Employee a = employeeRepository.findStoreIdByAccountEmpId(account.getId());
        System.out.println(a.getEmployeeAccount().getName());
        Customer customer=customerRepository.findByPhoneNumber(invoiceRequest.getInvoice().getCustomerPhone());
        Invoice invoice=new Invoice();
        invoice.setProductMoney(invoiceRequest.getInvoice().getTotalAmount());
        invoice.setShipMoney(invoiceRequest.getInvoice().getTotalShipping());
        invoice.setStatus(true);
        invoice.setType(false);
        invoice.setCreatedBy(a.getEmployeeAccount().getUsername());
        invoice.setCustomerName(capitalizeFirstLetters(invoiceRequest.getInvoice().getCustomerName()));
        invoice.setCustomerPhoneNumber(invoiceRequest.getInvoice().getCustomerPhone());
        invoice.setCustomer(customer);
        invoice.setDescription(capitalizeFirstLetters(invoiceRequest.getInvoice().getDescription()));
        invoice.setStore(a.getStore());
        invoice.setDeletedAt(null);
        invoice.setDeletedBy(null);

        List<InvoiceDetail>details=invoiceRequest.getInvoiceDetails().stream().map(
             detail->{
                 InvoiceDetail invoiceDetail=new InvoiceDetail();
                 Package packageEntity=packageRepository.findPackageByStringId(detail.getPackageId());
                 Product product=productRepository.findByStringId(detail.getProductID());
                 Category categoryProduct=categoryRepository.findByStringId(product.getCategory().getId());
                 long lastQuantity = product.getQuantity() - detail.getQuantity();
                 if (lastQuantity < 0) {
                     throw new IllegalArgumentException("Số lượng sản phẩm " + product.getName() + " không đủ trong kho!");
                 }
                 product.setQuantity(lastQuantity);
                 productRepository.save(product);
                 invoiceDetail.setDiscount(detail.getDiscount());
                 invoiceDetail.setPackageType(packageEntity);
                 invoiceDetail.setProductPrice(product.getPrice());
                 invoiceDetail.setQuantity(detail.getQuantity());
                 invoiceDetail.setProductCategoryDescription(categoryProduct.getDescription());
                 invoiceDetail.setProductCategoryName(categoryProduct.getName());
                 invoiceDetail.setProductImage(product.getProductImage());
                 invoiceDetail.setProductInformation(product.getInformation());
                 invoiceDetail.setProductName(product.getName());
                 invoiceDetail.setInvoice(invoice);
                 return invoiceDetail;
             }).collect(Collectors.toList());
            invoice.setInvoiceDetails(details);
            invoiceRepository.save(invoice);
    }

    @Override
    public Page<InvoiceDTO> getInvoicesForEmployee(String phoneNumber, int page, int size, String sortBy, boolean descending) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Tài khoản không tồn tại"));
        Employee a = employeeRepository.findStoreIdByAccountEmpId(account.getId());
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        if (phoneNumber.equals("")) {
            phoneNumber = null;
        }else{
            phoneNumber = capitalizeFirstLetters(phoneNumber);
        }
        Page<Invoice> invoicePage=invoiceRepository.findInvoiceByCustomerPhone(phoneNumber,a.getStore().getId(),pageable);
       return invoicePage.map(invoiceConverter::toEmployeeInvoiceDTO);
    }

    public String capitalizeFirstLetters(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }
        String[] words = input.split("\\s+");
        StringBuilder capitalizedString = new StringBuilder();
        for (String word : words) {
            if (word.length() > 0) {
                capitalizedString.append(word.substring(0, 1).toUpperCase())
                        .append(word.substring(1).toLowerCase())
                        .append(" ");
            }
        }
        return capitalizedString.toString().trim();
    }

    private void validateInvoiceRequest(InvoiceRequest invoiceRequest) {
        if (invoiceRequest == null) {
            throw new IllegalArgumentException("hóa đơn không được null!");
        }
        if (invoiceRequest.getEmployeeUsername() == null || invoiceRequest.getEmployeeUsername().isEmpty()) {
            throw new IllegalArgumentException("Tên nhân viên không được để trống!");
        }
        if (invoiceRequest.getInvoice() == null) {
            throw new IllegalArgumentException("Thông tin hóa đơn không được null!");
        }
        if (!invoiceRequest.getInvoice().getCustomerPhone().matches("^0\\d{9}$")) {
            throw new IllegalArgumentException("Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0!");
        }
        if (invoiceRequest.getInvoice().getCustomerName() == null || invoiceRequest.getInvoice().getCustomerName().isEmpty()) {
            throw new IllegalArgumentException("Tên khách hàng không được để trống!");
        }
        if (invoiceRequest.getInvoice().getTotalAmount() < 0 || invoiceRequest.getInvoice().getTotalShipping() < 0) {
            throw new IllegalArgumentException("Tổng tiền hoặc phí vận chuyển không được < 0!");
        }
        if (invoiceRequest.getInvoiceDetails() == null || invoiceRequest.getInvoiceDetails().isEmpty()) {
            throw new IllegalArgumentException("detail hóa đơn không được để trống!");
        }
        for (InvoiceDetailDTO detail : invoiceRequest.getInvoiceDetails()) {
            if (detail.getProductID() == null || detail.getProductID().isEmpty()) {
                throw new IllegalArgumentException("ID sản phẩm không được để trống!");
            }
            if (detail.getQuantity() <= 0) {
                throw new IllegalArgumentException("Số lượng sản phẩm phải lớn hơn 0!");
            }
        }
    }
}