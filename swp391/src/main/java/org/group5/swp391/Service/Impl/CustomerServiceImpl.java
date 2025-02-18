package org.group5.swp391.Service.Impl;

import org.group5.swp391.Service.CustomerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.group5.swp391.Converter.CustomerConverter;
import org.group5.swp391.DTO.EmployeeDTO.EmployeeCustomerDTO;
import org.group5.swp391.Entity.Customer;
import org.group5.swp391.Entity.Store;
import org.group5.swp391.Repository.CustomerRepository;
import org.group5.swp391.Repository.StoreRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;
    private final CustomerConverter CustomerConverter;
    private final StoreRepository storeRepository;


    @Override
    public Page<EmployeeCustomerDTO> EmployeeGetAllCustomer(int page, int size, String sortBy,
                                                            boolean descending, String phonesearch) {
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        if (phonesearch.equals("")) {
            phonesearch = null;
        }
        Page<Customer> customerPage = customerRepository.findAllWithPhoneNumber(pageable, phonesearch);
        return customerPage.map(CustomerConverter::toEmployeeCustomerDTO);
    }

    @Override
    public Customer updateCustomer(String customerId, Customer updatedCustomer) {
        Customer existingCustomer = customerRepository.findByCustomerID(customerId);
        existingCustomer.setName(capitalizeFirstLetters(updatedCustomer.getName()));
        existingCustomer.setPhoneNumber(updatedCustomer.getPhoneNumber());
        existingCustomer.setEmail(updatedCustomer.getEmail());
        existingCustomer.setAddress(updatedCustomer.getAddress());
        // Cập nhật updatedAt
        existingCustomer.setUpdatedAt(LocalDateTime.now());
        // Giữ nguyên giá trị createdAt nếu nó đã tồn tại
        return customerRepository.save(existingCustomer);
    }

    @Override
    public Customer createCustomer(EmployeeCustomerDTO customerDTO) {
        try {
            Customer customer = new Customer();
            customer.setName(capitalizeFirstLetters(customerDTO.getName()));
            customer.setPhoneNumber(customerDTO.getPhoneNumber());
            customer.setEmail(customerDTO.getEmail());
            customer.setAddress(customerDTO.getAddress());
            Store store = storeRepository.findByStoreID(customerDTO.getEmployeeStoreDTO().getStoreID());
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
