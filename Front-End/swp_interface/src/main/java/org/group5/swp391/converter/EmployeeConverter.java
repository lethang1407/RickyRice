package org.group5.swp391.converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.store_owner.all_employee.StoreAccountOfEmployeeDTO;
import org.group5.swp391.dto.store_owner.all_employee.StoreEmployeeDTO;
import org.group5.swp391.dto.store_owner.all_employee.StoreInfoOfEmployeeDTO;
import org.group5.swp391.entity.Employee;
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
                    employee.getStore().getId()
            );
        }

        StoreAccountOfEmployeeDTO storeAccount = null;
        if (employee.getEmployeeAccount() != null) {
            storeAccount = modelMapper.map(employee.getEmployeeAccount(), StoreAccountOfEmployeeDTO.class);
        }
        return new StoreEmployeeDTO(
                employee.getId(),
                storeAccount,
                storeInfo
        );
    }
}