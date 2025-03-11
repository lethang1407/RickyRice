package org.group5.swp391.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.EmployeeConverter;
import org.group5.swp391.dto.store_owner.all_employee.StoreEmployeeDTO;
import org.group5.swp391.entity.Account;
import org.group5.swp391.entity.Employee;
import org.group5.swp391.entity.Product;
import org.group5.swp391.entity.Store;
import org.group5.swp391.exception.AppException;
import org.group5.swp391.exception.ErrorCode;
import org.group5.swp391.repository.*;
import org.group5.swp391.service.EmployeeService;
import org.group5.swp391.utils.CloudinaryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private final AccountRepository accountRepository;
    private final StoreRepository storeRepository;
    private final EmployeeConverter employeeConverter;
    private final EmployeeRepository employeeRepository;
    private final CloudinaryService cloudinaryService;

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

    private Employee checkEmployeeOfUser(String employeeId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        return employeeRepository.findEmployeeForUser(username, employeeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy nhân viên"));
    }

    @Override
    public StoreEmployeeDTO getEmployee(String employeeId) {
        Employee employee = checkEmployeeOfUser(employeeId);
        return employeeConverter.toStoreEmployeeDTO(employee);
    }

    @Transactional
    public String updateStoreEmployeeImage(String employeeId, MultipartFile file) {
        checkEmployeeOfUser(employeeId);
        try {
            return cloudinaryService.uploadFile(file);
        } catch (IOException e) {
            throw new RuntimeException("Không thể tải ảnh lên!");
        }
    }

    @Transactional
    public StoreEmployeeDTO updateStoreEmployee(String employeeId, StoreEmployeeDTO storeEmployeeDTO) {
        Employee employee = checkEmployeeOfUser(employeeId);
        Account account = employee.getEmployeeAccount();
        boolean a = account.getEmail().equals(storeEmployeeDTO.getStoreAccount().getEmail());
        if(accountRepository.existsByEmail(storeEmployeeDTO.getStoreAccount().getEmail())&&!a) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        boolean b = account.getPhoneNumber().equals(storeEmployeeDTO.getStoreAccount().getPhoneNumber());
        if(accountRepository.existsByPhoneNumber(storeEmployeeDTO.getStoreAccount().getPhoneNumber()) && !b) {
            throw new AppException(ErrorCode.PHONENUMBER_EXISTED);
        }
        account.setName(storeEmployeeDTO.getStoreAccount().getName());
        account.setGender(storeEmployeeDTO.getStoreAccount().getGender());
        account.setEmail(storeEmployeeDTO.getStoreAccount().getEmail());
        account.setBirthDate(storeEmployeeDTO.getStoreAccount().getBirthDate());
        account.setPhoneNumber(storeEmployeeDTO.getStoreAccount().getPhoneNumber());
        account.setAvatar(storeEmployeeDTO.getStoreAccount().getAvatar());
        accountRepository.save(account);
        return employeeConverter.toStoreEmployeeDTO(employee);
    }


    @Transactional
    public void deleteEmployee(String employeeId) {
        Employee employee = checkEmployeeOfUser(employeeId);
        employeeRepository.delete(employee);
    }





}
