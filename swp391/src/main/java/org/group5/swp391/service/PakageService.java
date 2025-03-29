package org.group5.swp391.service;

import org.group5.swp391.dto.employee.EmployeePackageDTO;
import org.group5.swp391.dto.packagee.PackageCreationRequest;
import org.group5.swp391.dto.packagee.PackageDTO;
import org.group5.swp391.dto.response.PageResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PakageService {
    List<EmployeePackageDTO> findAllPackages();
    PageResponse<PackageDTO> getPackages(int pageNo, int pageSize, String sortBy, String storeId, Long quantity, String name);
    public void createPackage(PackageCreationRequest request);
}
