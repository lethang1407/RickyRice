package org.group5.swp391.service.impl;

import org.group5.swp391.entity.Account;
import org.group5.swp391.entity.Employee;
import org.group5.swp391.repository.AccountRepository;
import org.group5.swp391.repository.EmployeeRepository;
import org.group5.swp391.service.CustomerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.group5.swp391.converter.CustomerConverter;
import org.group5.swp391.dto.employee.EmployeeCustomerDTO;
import org.group5.swp391.entity.Customer;
import org.group5.swp391.entity.Store;
import org.group5.swp391.repository.CustomerRepository;
import org.group5.swp391.repository.StoreRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;
    private final CustomerConverter CustomerConverter;
    private final StoreRepository storeRepository;
    private final EmployeeRepository employeeRepository;
    private final AccountRepository accountRepository;


    @Override
    public Page<EmployeeCustomerDTO> EmployeeGetAllCustomer(int page, int size, String sortBy,
                                                            boolean descending, String phonesearch) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Tài khoản không tồn tại"));
        Employee a = employeeRepository.findStoreIdByAccountEmpId(account.getAccountID());
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        if (phonesearch.equals("")) {
            phonesearch = null;
        }else{
            phonesearch = phonesearch.toLowerCase();
            phonesearch = capitalizeFirstLetters(phonesearch);
        }
        Page<Customer> customerPage = customerRepository.findAllWithPhoneNumber(pageable, phonesearch,a.getStore().getStoreID());
        return customerPage.map(CustomerConverter::toEmployeeCustomerDTO);
    }

    @Override
    public Customer updateCustomer(String customerId, Customer updatedCustomer) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Tài khoản không tồn tại"));
        Employee a = employeeRepository.findStoreIdByAccountEmpId(account.getAccountID());
        System.out.println(a.getEmployeeAccount().getName());
        Customer existingCustomer = customerRepository.findByCustomerID(customerId);
        existingCustomer.setCreatedBy(a.getEmployeeAccount().getName());
        existingCustomer.setName(capitalizeFirstLetters(updatedCustomer.getName()));
        existingCustomer.setPhoneNumber(updatedCustomer.getPhoneNumber());
        existingCustomer.setEmail(updatedCustomer.getEmail());
        existingCustomer.setAddress(updatedCustomer.getAddress());
        existingCustomer.setUpdatedAt(LocalDateTime.now());
        return customerRepository.save(existingCustomer);
    }

    @Override
    public Customer createCustomer(EmployeeCustomerDTO customerDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Tài khoản không tồn tại"));
        Employee a = employeeRepository.findStoreIdByAccountEmpId(account.getAccountID());
        try {
            Customer customer = new Customer();
            customer.setName(capitalizeFirstLetters(customerDTO.getName()));
            customer.setPhoneNumber(customerDTO.getPhoneNumber());
            customer.setEmail(customerDTO.getEmail());
            customer.setAddress(customerDTO.getAddress());
            customer.setCreatedBy(a.getEmployeeAccount().getName());
            Store store = storeRepository.findByStoreID(a.getStore().getStoreID());
            customer.setStore(store);
            log.info("Saving customer thanh cong : {}", customer);
            return customerRepository.save(customer);
        } catch (Exception ex) {
            log.error("Error creating customer: {}", ex.getMessage(), ex);
            throw new RuntimeException("Không thể tạo khách hàng: " + ex.getMessage());
        }
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
}
