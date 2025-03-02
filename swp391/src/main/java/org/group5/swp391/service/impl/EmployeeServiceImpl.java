package org.group5.swp391.service.impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.EmployeeConverter;
import org.group5.swp391.dto.store_owner.StoreEmployeeDTO;
import org.group5.swp391.entity.Account;
import org.group5.swp391.entity.Employee;
import org.group5.swp391.entity.Store;
import org.group5.swp391.repository.*;
import org.group5.swp391.service.EmployeeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private final AccountRepository accountRepository;
    private final StoreRepository storeRepository;
    private final EmployeeConverter employeeConverter;
    private final EmployeeRepository employeeRepository;

    @Override
    public Page<StoreEmployeeDTO> getEmployees(String employeeName, int page, int size, String sortBy, boolean descending, String genderStr) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tài khoản không tồn tại"));
        List<Store> stores = storeRepository.findByStoreAccount(account);
        if (stores.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bạn không quản lý cửa hàng nào.");
        }
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Boolean gender = null;
        if (!genderStr.equalsIgnoreCase("all")) {
            gender = genderStr.equalsIgnoreCase("Male");
        }
        Page<Employee> employees = employeeRepository.findByStoreInAndNameAndGender(
                stores,
                (employeeName == null || employeeName.isEmpty()) ? null : employeeName,
                gender,
                pageable
        );
        return employees.map(employeeConverter::toStoreEmployeeDTO);
    }

}
