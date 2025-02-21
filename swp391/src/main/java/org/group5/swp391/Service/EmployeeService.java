package org.group5.swp391.Service;

import org.group5.swp391.DTO.StoreOwnerDTO.StoreEmployeeDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface EmployeeService {
    public Page<StoreEmployeeDTO> getEmployees(String employeeName, int page, int size, String sortBy, boolean descending, String gender);
}
