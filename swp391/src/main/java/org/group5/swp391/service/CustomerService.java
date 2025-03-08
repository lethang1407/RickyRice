package org.group5.swp391.service;

import org.group5.swp391.dto.employee.CustomerUpdateRequest;
import org.group5.swp391.dto.employee.EmployeeCustomerDTO;
import org.group5.swp391.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CustomerService {
    public Page<EmployeeCustomerDTO> EmployeeGetAllCustomer(int page, int size, String sortBy, boolean descending, String phonesearch);
    public List<EmployeeCustomerDTO>EmployeeGetAllCustomerInList(String phonesearch);
    public Customer updateCustomer(String customerId, Customer updatedCustomer);
    public Customer InvoiceUpdateCustomer(String phoneNumber, CustomerUpdateRequest updatedCustomer);
    Customer createCustomer(EmployeeCustomerDTO customerDTO);
}
