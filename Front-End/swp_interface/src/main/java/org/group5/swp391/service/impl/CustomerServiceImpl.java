package org.group5.swp391.service.impl;

import org.group5.swp391.dto.debt.CustomerCreationRequest;
import org.group5.swp391.dto.debt.CustomerDebtUpdateRequest;
import org.group5.swp391.dto.debt.DebtCustomerDTO;
import jakarta.transaction.Transactional;
import org.group5.swp391.dto.employee.CustomerUpdateRequest;
import org.group5.swp391.dto.response.PageResponse;
import org.group5.swp391.entity.Account;
import org.group5.swp391.entity.Employee;
import org.group5.swp391.exception.AppException;
import org.group5.swp391.exception.ErrorCode;
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
import org.group5.swp391.utils.CurrentUserDetails;
import org.hibernate.id.enhanced.CustomOptimizerDescriptor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;
    private final CustomerConverter CustomerConverter;
    private final StoreRepository storeRepository;
    private final EmployeeRepository employeeRepository;
    private final AccountRepository accountRepository;
    private final CustomerConverter customerConverter;


    @Override
    public Page<EmployeeCustomerDTO> EmployeeGetAllCustomer(int page, int size, String sortBy,
                                                            boolean descending, String phonesearch) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        System.out.println(username);
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Tài khoản không tồn tại"));
        Employee a = employeeRepository.findStoreIdByAccountEmpId(account.getId());

        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        if (phonesearch.equals("")) {
            phonesearch = null;
        } else {
            phonesearch = phonesearch.toLowerCase();
            phonesearch = capitalizeFirstLetters(phonesearch);
        }

        Page<Customer> customerPage = customerRepository.findAllWithPhoneNumber(pageable, phonesearch, a.getStore().getId());
        log.info("heeh" + customerPage.getContent().get(0).getStore().getId());
        return customerPage.map(CustomerConverter::toEmployeeCustomerDTO);
    }

    @Override
    public List<EmployeeCustomerDTO> EmployeeGetAllCustomerInList(String phonesearch) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Tài khoản không tồn tại"));
        Employee a = employeeRepository.findStoreIdByAccountEmpId(account.getId());
        if (phonesearch.equals("")) {
            phonesearch = null;
        } else {
            phonesearch = phonesearch.toLowerCase();
            phonesearch = capitalizeFirstLetters(phonesearch);
        }
        List<Customer> customerList = customerRepository.findAllWithPhoneNumberInList(phonesearch, a.getStore().getId());
        return customerList.stream().map(CustomerConverter::toEmployeeCustomerDTO).collect(Collectors.toList());
    }

    @Override
    public Customer updateCustomer(String customerId, Customer updatedCustomer) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        System.out.println(username);
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Tài khoản không tồn tại"));
        validatePhoneNumber(updatedCustomer.getPhoneNumber());
        if (updatedCustomer.getEmail() != null) {
            validateEmail(updatedCustomer.getEmail());
        }
        Employee a = employeeRepository.findStoreIdByAccountEmpId(account.getId());
        System.out.println("tai sao nhi" + a.getEmployeeAccount().getName());
        Customer existingCustomer = customerRepository.findById(customerId).orElseThrow();
        if(existingCustomer!=null) {
            if(!existingCustomer.getName().equals(updatedCustomer.getName())) {
                throw new IllegalArgumentException("Số điện thoại này là của khách hàng khác");
            }
        }
        existingCustomer.setCreatedBy(username);
        existingCustomer.setName(capitalizeFirstLetters(updatedCustomer.getName()));
        existingCustomer.setPhoneNumber(updatedCustomer.getPhoneNumber());
        existingCustomer.setEmail(updatedCustomer.getEmail());
        existingCustomer.setAddress(updatedCustomer.getAddress());
        existingCustomer.setBalance(updatedCustomer.getBalance());
        existingCustomer.setUpdatedAt(LocalDateTime.now());
        return customerRepository.save(existingCustomer);
    }

    @Override
    @Transactional
    public Customer InvoiceUpdateCustomer(String phoneNumber, CustomerUpdateRequest updatedCustomer) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Tài khoản không tồn tại"));
        Employee a = employeeRepository.findStoreIdByAccountEmpId(account.getId());
        Customer existingCustomer = customerRepository.findByPhoneNumber(phoneNumber);
        Customer existingCustomerByNewPhone = customerRepository.findByPhoneNumber(updatedCustomer.getPhoneNumberNew());
        if(existingCustomerByNewPhone!=null) {
                throw new AppException(ErrorCode.PHONENUMBER_EXISTED);
        }
        validatePhoneNumber(updatedCustomer.getPhoneNumberNew());
        existingCustomer.setCreatedBy(username);
        existingCustomer.setName(capitalizeFirstLetters(updatedCustomer.getName()));
        existingCustomer.setPhoneNumber(updatedCustomer.getPhoneNumberNew());
        existingCustomer.setEmail(existingCustomer.getEmail());
        existingCustomer.setAddress(existingCustomer.getAddress());
        existingCustomer.setUpdatedAt(LocalDateTime.now());
        return customerRepository.save(existingCustomer);
    }


    @Override
    @Transactional
    public Customer createCustomer(EmployeeCustomerDTO customerDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Tài khoản không tồn tại"));
        Employee a = employeeRepository.findStoreIdByAccountEmpId(account.getId());
            validatePhoneNumber(customerDTO.getPhoneNumber());
            if (customerDTO.getEmail() != null) {
                validateEmail(customerDTO.getEmail());
            }
            Customer customer = new Customer();
            customer.setName(capitalizeFirstLetters(customerDTO.getName()));
            Customer existingCustomer = customerRepository.findByPhoneNumber(customerDTO.getPhoneNumber());
            List<Customer> existingCustomerEmail = customerRepository.findByEmail(customerDTO.getEmail());
            if(existingCustomer!=null) {
                throw new AppException(ErrorCode.PHONENUMBER_EXISTED);
            }
            if(customerDTO.getEmail() !=null) {
                for (Customer c : existingCustomerEmail){
                    if(c.getEmail().equals(customerDTO.getEmail())) {
                        throw new AppException(ErrorCode.EMAIL_EXISTED);
                    }
                }
            }
            customer.setPhoneNumber(customerDTO.getPhoneNumber());
            customer.setEmail(customerDTO.getEmail());
            customer.setAddress(customerDTO.getAddress());
            customer.setCreatedBy(username);
            log.info("haha " + a.getStore().getId());
            Store store = storeRepository.findById(a.getStore().getId()).orElseThrow();
            System.out.println(store.getStoreName());
            customer.setStore(store);
            log.info("Saving customer thanh cong : {}", customer);
            return customerRepository.save(customer);
    }

    @Override
    public List<EmployeeCustomerDTO> getCustomerForDebt() {
        List<String> storeList = CurrentUserDetails.getCurrentStores();
        return customerRepository.getCustomersForDebts(storeList);
    }

    @Override
    public PageResponse<DebtCustomerDTO> getDebtCustomers(Integer pageNo, Integer pageSize, String sortBy, String storeId,
                                                          LocalDate startCreatedAt, LocalDate endCreatedAt, LocalDate startUpdatedAt,
                                                          LocalDate endUpdatedAt, String customerName, String phoneNumber, String email,
                                                          String address, Double fromAmount, Double toAmount, String createdBy) {

        Sort sort = Sort.by("createdAt").descending();

        int p = 0;
        if(pageNo >= 0){
            p = pageNo - 1;
        }

        if (StringUtils.hasLength(sortBy)) {
            Pattern pattern = Pattern.compile("(\\w+?)(:)(asc|desc)");
            Matcher matcher = pattern.matcher(sortBy);
            if (matcher.find()) {
                String columnName = matcher.group(1);
                if (matcher.group(3).equalsIgnoreCase("asc")) {
                    sort = Sort.by(columnName).ascending();
                } else {
                    sort = Sort.by(columnName).descending();
                }
            }
        }

        List<String> storeList;
        if(!StringUtils.hasLength(storeId)){
            storeList = CurrentUserDetails.getCurrentStores();
        }else{
            String[] list = storeId.split(" ");
            storeList = Arrays.stream(list).toList();
        }

        Pageable pageable = PageRequest.of(p, pageSize, sort);

        Page<Customer> listCustomer = customerRepository.searchForDebtCustomer(storeList, startCreatedAt!=null ? startCreatedAt.atStartOfDay() : null,
                endCreatedAt!=null ? endCreatedAt.atTime(23, 59, 59) : null, startUpdatedAt!=null ? startUpdatedAt.atStartOfDay() : null,
                endUpdatedAt!=null ? endUpdatedAt.atTime(23, 59, 59) : null, customerName, phoneNumber,
                email, address, fromAmount, toAmount, createdBy, pageable);

        List<DebtCustomerDTO> dtos = listCustomer.stream().map(customerConverter::debtCustomerDTO).toList();

        return PageResponse.<DebtCustomerDTO>builder()
                .pageNo(pageNo)
                .pageSize(pageSize)
                .data(dtos)
                .totalPages((long) listCustomer.getTotalPages())
                .build();
    }

    @Override
    public void updateCustomerDebt(String id, CustomerDebtUpdateRequest request) {
        Customer update = customerConverter.toCustomerEntity(request);
        Customer now = customerRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        if(request.getPhoneNumber()!=null){
            if(!request.getPhoneNumber().equals(now.getPhoneNumber()) && customerRepository.existsByPhoneNumber(request.getPhoneNumber())){
                throw new AppException(ErrorCode.PHONENUMBER_EXISTED);
            }
        }
        if(request.getEmail()!=null){
            if(!request.getEmail().equals(now.getEmail()) && customerRepository.existsByEmail(request.getEmail())){
                throw new AppException(ErrorCode.EMAIL_EXISTED);
            }
        }
        try{
            Field[] fields = Customer.class.getDeclaredFields();
            for(Field field : fields){
                field.setAccessible(true);
                if(field.get(update)!=null){
                    field.set(now,field.get(update));
                }
            }
            customerRepository.save(now);
        }catch (Exception e){
            throw new AppException(ErrorCode.UNCATEGORIZED);
        }
    }

    @Override
    public void createCustomerDebt(CustomerCreationRequest request) {
        if(customerRepository.existsByPhoneNumber(request.getPhoneNumber())){
            throw new AppException(ErrorCode.PHONENUMBER_EXISTED);
        }
        if(request.getEmail()!=null && customerRepository.existsByEmail(request.getEmail())){
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        Customer customer = customerConverter.toCustomerEntity(request);
        Store store = storeRepository.findById(request.getStoreId()).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        customer.setStore(store);
        customer.setId(null);
        customerRepository.save(customer);
    }

    @Override
    public DebtCustomerDTO getDebtCustomerById(String id) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return customerConverter.debtCustomerDTO(customer);
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

    private void validatePhoneNumber(String phoneNumber) {
        if (phoneNumber == null || !phoneNumber.matches("^0\\d{9}$")) {
            throw new AppException(ErrorCode.PHONENUMBER_INVALID);
        }
    }

    private void validateEmail(String email) {
        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$")) {
            throw new AppException(ErrorCode.EMAIL_INVALID);
        }
    }
}
