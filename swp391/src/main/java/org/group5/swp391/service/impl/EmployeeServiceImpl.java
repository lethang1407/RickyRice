package org.group5.swp391.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.AccountConverter;
import org.group5.swp391.converter.EmployeeConverter;
import org.group5.swp391.dto.request.authentication_request.AccountCreationRequest;
import org.group5.swp391.dto.response.AuthenticationResponse.AccountCreationResponse;
import org.group5.swp391.dto.store_owner.all_employee.StoreAddEmployeeDTO;
import org.group5.swp391.dto.store_owner.all_employee.StoreEmployeeDTO;
import org.group5.swp391.entity.*;
import org.group5.swp391.exception.AppException;
import org.group5.swp391.exception.ErrorCode;
import org.group5.swp391.repository.*;
import org.group5.swp391.service.EmployeeService;
import org.group5.swp391.utils.CloudinaryService;
import org.modelmapper.ModelMapper;
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
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private final AccountRepository accountRepository;
    private final StoreRepository storeRepository;
    private final EmployeeConverter employeeConverter;
    private final EmployeeRepository employeeRepository;
    private final CloudinaryService cloudinaryService;
    private final NotificationRepository notificationRepository;
    private final AccountConverter accountConverter;

    @Override
    public Page<StoreEmployeeDTO> getEmployees(String employeeID, String name, String email, String phoneNumber, List<String> store, String strGender, int page, int size, String sortBy, boolean descending) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Boolean gender = null;
        if (!strGender.equalsIgnoreCase("all")) {
            gender = strGender.equalsIgnoreCase("Male");
        }
        employeeID = (employeeID != null && !employeeID.trim().isEmpty()) ? employeeID.trim() : null;
        name = (name != null && !name.trim().isEmpty()) ? name.trim() : null;
        phoneNumber = (phoneNumber != null && !phoneNumber.trim().isEmpty()) ? phoneNumber.trim() : null;
        if (store != null && store.isEmpty()) {
            store = null;
        }
        Page<Employee> employees = employeeRepository.findStoreEmployees(
                username, employeeID, name, email, phoneNumber, store, gender, pageable
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
    public String updateStoreEmployeeImage(MultipartFile file) {
        try {
            return cloudinaryService.uploadFile(file);
        } catch (IOException e) {
            throw new AppException(ErrorCode.CANT_UPLOAD_IMAGE);
        }
    }

    @Transactional
    public StoreEmployeeDTO updateStoreEmployee(String employeeId, StoreEmployeeDTO storeEmployeeDTO) {
        Employee employee = checkEmployeeOfUser(employeeId);
        Account account = employee.getEmployeeAccount();
        boolean c = account.getUsername().equals(storeEmployeeDTO.getStoreAccount().getUsername());
        if (accountRepository.existsByUsername(storeEmployeeDTO.getStoreAccount().getUsername()) && !c) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
        boolean a = account.getEmail().equals(storeEmployeeDTO.getStoreAccount().getEmail());
        if (accountRepository.existsByEmail(storeEmployeeDTO.getStoreAccount().getEmail()) && !a) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        boolean b = account.getPhoneNumber().equals(storeEmployeeDTO.getStoreAccount().getPhoneNumber());
        if (accountRepository.existsByPhoneNumber(storeEmployeeDTO.getStoreAccount().getPhoneNumber()) && !b) {
            throw new AppException(ErrorCode.PHONENUMBER_EXISTED);
        }
        account.setUsername(storeEmployeeDTO.getStoreAccount().getUsername());
        account.setPassword(storeEmployeeDTO.getStoreAccount().getPassword() != null ? storeEmployeeDTO.getStoreAccount().getPassword() : account.getPassword());
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
    public void createEmployee(StoreAddEmployeeDTO storeEmployeeDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        boolean c = accountRepository.existsByUsername(storeEmployeeDTO.getUsername());
        if (c) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
        boolean a = accountRepository.existsByEmail(storeEmployeeDTO.getEmail());
        if (a) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        boolean b = accountRepository.existsByPhoneNumber(storeEmployeeDTO.getPhoneNumber());
        if (b) {
            throw new AppException(ErrorCode.PHONENUMBER_EXISTED);
        }
        AccountCreationRequest accountCreated = new AccountCreationRequest(storeEmployeeDTO.getUsername(), storeEmployeeDTO.getPassword(), storeEmployeeDTO.getName(), storeEmployeeDTO.getEmail(), storeEmployeeDTO.getPhoneNumber(), storeEmployeeDTO.getAvatar(), storeEmployeeDTO.getBirthDate(), storeEmployeeDTO.getGender(), "EMPLOYEE");
        Account account = accountConverter.toAccountEntity(accountCreated);
        Account a1 = accountRepository.save(account);
        Employee employee = new Employee(a1, storeRepository.findById(storeEmployeeDTO.getStoreId()).orElse(null));
        employee.setCreatedAt(LocalDateTime.now());
        employee.setCreatedBy(username);
        employeeRepository.save(employee);
    }

    @Transactional
    public void deleteEmployee(String employeeId) {
        Employee employee = checkEmployeeOfUser(employeeId);
        String accountId = employee.getEmployeeAccount().getId();
        List<Notification> notifications = notificationRepository.findByTargetAccount_IdOrSendAccount_Id(accountId, accountId);
        if (!notifications.isEmpty()) {
            notificationRepository.deleteAll(notifications);
        }
        employeeRepository.delete(employee);
    }





}
