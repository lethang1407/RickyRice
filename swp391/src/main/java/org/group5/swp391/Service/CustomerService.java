package org.group5.swp391.Service;

import org.group5.swp391.DTO.EmployeeDTO.EmployeeCustomerDTO;
import org.group5.swp391.Entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface CustomerService {
    public Page<EmployeeCustomerDTO> EmployeeGetAllCustomer(int page, int size, String sortBy, boolean descending, String phonesearch);
    public Customer updateCustomer(String customerId, Customer updatedCustomer);
    Customer createCustomer(EmployeeCustomerDTO customerDTO);
}
