package org.group5.swp391.controller.employee;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.employee.EmployeePackageDTO;
import org.group5.swp391.service.impl.PackageServiceImpl;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/employee")
@RequiredArgsConstructor
public class EmployeePackageController {
    private final PackageServiceImpl packageService;

    @GetMapping("/packageList")
    public List<EmployeePackageDTO> getPackages() {
        return packageService.findAllPackages();
    }
}
