package org.group5.swp391.Converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.EmployeeDTO.EmployeeCustomerDTO;
import org.group5.swp391.DTO.EmployeeDTO.EmployeeStoreDTO;
import org.group5.swp391.Entity.Customer;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.time.ZoneId;

@Component
@RequiredArgsConstructor
public class CustomerConverter {
    private final ModelMapper modelMapper;
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
        dto.setCustomerID(customer.getCustomerID());
        dto.setName(customer.getName());
        dto.setPhoneNumber(customer.getPhoneNumber());
        dto.setEmail(customer.getEmail());
        dto.setAddress(customer.getAddress());
        dto.setEmployeeStoreDTO((customer.getStore() != null) ? modelMapper.map(customer.getStore(), EmployeeStoreDTO.class) : null);
        if (customer.getCreatedAt() != null) {
            dto.setCreated_at(customer.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
        }
        // Convert LocalDateTime to epoch millis (long)
        if (customer.getUpdatedAt() != null) {
            dto.setUpdated_at(customer.getUpdatedAt().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
        }
        return dto;
    }
}
