package org.group5.swp391.service;

import org.group5.swp391.dto.debt.CustomerCreationRequest;
import org.group5.swp391.dto.debt.CustomerDebtUpdateRequest;
import org.group5.swp391.dto.debt.DebtCustomerDTO;
import org.group5.swp391.dto.employee.CustomerUpdateRequest;
import org.group5.swp391.dto.employee.EmployeeCustomerDTO;
import org.group5.swp391.dto.response.PageResponse;
import org.group5.swp391.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public interface CustomerService {
    public Page<EmployeeCustomerDTO> EmployeeGetAllCustomer(int page, int size, String sortBy, boolean descending, String phonesearch);
    public List<EmployeeCustomerDTO>EmployeeGetAllCustomerInList(String phonesearch);
    public Customer updateCustomer(String customerId, Customer updatedCustomer);
    public Customer InvoiceUpdateCustomer(String phoneNumber, CustomerUpdateRequest updatedCustomer);
    Customer createCustomer(EmployeeCustomerDTO customerDTO);
    public List<EmployeeCustomerDTO> getCustomerForDebt();
    public PageResponse<DebtCustomerDTO> getDebtCustomers(Integer pageNo, Integer pageSize, String sortBy, String storeId,
                                                          LocalDate startCreatedAt, LocalDate endCreatedAt, LocalDate startUpdatedAt,
                                                          LocalDate endUpdatedAt, String customerName, String phoneNumber, String email,
                                                          String address, Double fromAmount, Double toAmount, String createdBy);
    public void updateCustomerDebt(String customerId, CustomerDebtUpdateRequest request);
    public void createCustomerDebt(CustomerCreationRequest request);
    public DebtCustomerDTO getDebtCustomerById(String id);
    public Customer getCustomerByPhone(String phone);
}
