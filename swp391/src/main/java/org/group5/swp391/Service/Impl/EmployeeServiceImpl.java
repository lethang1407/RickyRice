package org.group5.swp391.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.Converter.EmployeeConverter;
import org.group5.swp391.Converter.InvoiceConverter;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreEmployeeDTO;
import org.group5.swp391.Entity.Account;
import org.group5.swp391.Entity.Customer;
import org.group5.swp391.Entity.Employee;
import org.group5.swp391.Entity.Store;
import org.group5.swp391.Repository.*;
import org.group5.swp391.Service.EmployeeService;
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

import static org.springframework.http.HttpStatus.NOT_FOUND;

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
