package org.group5.swp391.service;

import org.group5.swp391.dto.store_owner.all_employee.StoreEmployeeDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public interface EmployeeService {
    public Page<StoreEmployeeDTO> getEmployees(String employeeID, String name, String email, String phoneNumber, List<String> store, String gender, int page, int size, String sortBy, boolean descending);

    public StoreEmployeeDTO getEmployee(String employeeId);

    public String updateStoreEmployeeImage(String employeeId, MultipartFile file);

    public StoreEmployeeDTO updateStoreEmployee(String employeeId, StoreEmployeeDTO storeEmployeeDTO);

    public void deleteEmployee(String employeeId);
    }
