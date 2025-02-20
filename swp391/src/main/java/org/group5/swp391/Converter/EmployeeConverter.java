package org.group5.swp391.Converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreAccountOfEmployeeDTO;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreEmployeeDTO;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreInfoOfEmployeeDTO;
import org.group5.swp391.Entity.Employee;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class EmployeeConverter {
    private final ModelMapper modelMapper;

    public StoreEmployeeDTO toStoreEmployeeDTO(Employee employee) {
        if (employee == null) {
            return null;
        }

        StoreInfoOfEmployeeDTO storeInfo = null;
        if (employee.getStore() != null) {
            storeInfo = new StoreInfoOfEmployeeDTO(
                    employee.getStore().getStoreName(),
                    employee.getStore().getStoreID()
            );
        }

        StoreAccountOfEmployeeDTO storeAccount = null;
        if (employee.getEmployeeAccount() != null) {
            storeAccount = modelMapper.map(employee.getEmployeeAccount(), StoreAccountOfEmployeeDTO.class);
        }
        return new StoreEmployeeDTO(
                employee.getEmployeeID(),
                storeAccount,
                storeInfo
        );
    }
}