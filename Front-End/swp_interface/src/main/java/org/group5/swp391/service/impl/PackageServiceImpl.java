package org.group5.swp391.service.impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.PackageConverter;
import org.group5.swp391.dto.employee.EmployeePackageDTO;
import org.group5.swp391.entity.Account;
import org.group5.swp391.entity.Employee;
import org.group5.swp391.entity.Package;
import org.group5.swp391.repository.AccountRepository;
import org.group5.swp391.repository.EmployeeRepository;
import org.group5.swp391.repository.PackageRepository;
import org.group5.swp391.service.PakageService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class PackageServiceImpl implements PakageService {
    private final PackageRepository packageRepository;
    private final AccountRepository accountRepository;
    private final EmployeeRepository employeeRepository;
    private final PackageConverter packageConverter;

    @Override
    public List<EmployeePackageDTO> findAllPackages() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Tài khoản không tồn tại"));
        Employee a = employeeRepository.findStoreIdByAccountEmpId(account.getId());
        List<Package> packageList=packageRepository.findPackagesByStoreId(a.getStore().getId());
        return packageList.stream().map(packageConverter::toEmployeePackageDTO).collect(Collectors.toList());
    }
}
