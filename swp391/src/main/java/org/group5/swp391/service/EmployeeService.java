package org.group5.swp391.service;

import org.group5.swp391.dto.store_owner.all_employee.StoreEmployeeDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface EmployeeService {
    public Page<StoreEmployeeDTO> getEmployees(String employeeName, int page, int size, String sortBy, boolean descending, String gender);

    public StoreEmployeeDTO getEmployee(String employeeId);

    public String updateStoreEmployeeImage(String employeeId, MultipartFile file);

    public StoreEmployeeDTO updateStoreEmployee(String employeeId, StoreEmployeeDTO storeEmployeeDTO);

    public void deleteEmployee(String employeeId);
    }
