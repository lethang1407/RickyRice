package org.group5.swp391.service;

import org.group5.swp391.dto.employee.EmployeePackageDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PakageService {
    List<EmployeePackageDTO> findAllPackages();
}
