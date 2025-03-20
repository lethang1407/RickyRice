package org.group5.swp391.converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.debt.CustomerCreationRequest;
import org.group5.swp391.dto.debt.CustomerDebtUpdateRequest;
import org.group5.swp391.dto.debt.DebtCustomerDTO;
import org.group5.swp391.dto.employee.EmployeeCustomerDTO;
import org.group5.swp391.dto.employee.EmployeeStoreDTO;
import org.group5.swp391.entity.Customer;
import org.group5.swp391.entity.Store;
import org.group5.swp391.exception.AppException;
import org.group5.swp391.exception.ErrorCode;
import org.group5.swp391.repository.StoreRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.time.ZoneId;

@Component
@RequiredArgsConstructor
public class CustomerConverter {
    private final ModelMapper modelMapper;
    private final StoreRepository storeRepository;

    //minh_snuppi
//    public EmployeeCustomerDTO toEmployeeCustomerDTO(Customer customer) {
//        EmployeeCustomerDTO dto = modelMapper.map(customer, EmployeeCustomerDTO.class);
//        if (customer.getStore() != null) {
//            dto.setEmployeeStoreDTO(modelMapper.map(customer.getStore(), EmployeeStoreDTO.class));
//        } else {
//            dto.setEmployeeStoreDTO(null);
//        }
//        return dto;
//    }
    public EmployeeCustomerDTO toEmployeeCustomerDTO(Customer customer) {
        EmployeeCustomerDTO dto = new EmployeeCustomerDTO();
        dto.setCustomerID(customer.getId());
        dto.setName(customer.getName());
        dto.setPhoneNumber(customer.getPhoneNumber());
        dto.setEmail(customer.getEmail());
        dto.setAddress(customer.getAddress());
        dto.setCreated_by(customer.getCreatedBy());
        dto.setBalance(customer.getBalance());
        dto.setEmployeeStoreDTO((customer.getStore() != null) ? modelMapper.map(customer.getStore(), EmployeeStoreDTO.class) : null);
        if (customer.getStore() != null) {
            dto.getEmployeeStoreDTO().setStoreID(customer.getStore().getId());
        }
        if (customer.getCreatedAt() != null) {
            dto.setCreated_at(customer.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
        }
        // Convert LocalDateTime to epoch millis (long)
        if (customer.getUpdatedAt() != null) {
            dto.setUpdated_at(customer.getUpdatedAt().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
        }
        return dto;
    }

    public DebtCustomerDTO debtCustomerDTO(Customer customer){
        DebtCustomerDTO dto = modelMapper.map(customer, DebtCustomerDTO.class);
        dto.setCustomerId(customer.getId());
        dto.setStoreId(customer.getStore().getId());
        return dto;
    }

    public Customer toCustomerEntity(CustomerCreationRequest request){
        Customer customer = modelMapper.map(request, Customer.class);
        customer.setBalance((double) 0);
        return customer;
    }

    public Customer toCustomerEntity(CustomerDebtUpdateRequest request){
        return modelMapper.map(request, Customer.class);
    }
}
