package org.group5.swp391.service.impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.PackageConverter;
import org.group5.swp391.dto.employee.EmployeePackageDTO;
import org.group5.swp391.dto.packagee.PackageCreationRequest;
import org.group5.swp391.dto.packagee.PackageDTO;
import org.group5.swp391.dto.response.PageResponse;
import org.group5.swp391.entity.Account;
import org.group5.swp391.entity.Employee;
import org.group5.swp391.entity.Package;
import org.group5.swp391.exception.AppException;
import org.group5.swp391.exception.ErrorCode;
import org.group5.swp391.repository.AccountRepository;
import org.group5.swp391.repository.EmployeeRepository;
import org.group5.swp391.repository.PackageRepository;
import org.group5.swp391.repository.StoreRepository;
import org.group5.swp391.service.PakageService;
import org.group5.swp391.utils.CurrentUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;


import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class PackageServiceImpl implements PakageService {
    private final PackageRepository packageRepository;
    private final AccountRepository accountRepository;
    private final EmployeeRepository employeeRepository;
    private final PackageConverter packageConverter;
    private final StoreRepository storeRepository;

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

    @Override
    public PageResponse<PackageDTO> getPackages(int pageNo, int pageSize, String sortBy, String storeId, Long quantity, String name) {
        Sort sort = Sort.by("quantity").descending();

        int p = 0;
        if(pageNo >= 0){
            p = pageNo - 1;
        }

        if (StringUtils.hasLength(sortBy)) {
            Pattern pattern = Pattern.compile("(\\w+?)(:)(asc|desc)");
            Matcher matcher = pattern.matcher(sortBy);
            if (matcher.find()) {
                String columnName = matcher.group(1);
                if (matcher.group(3).equalsIgnoreCase("asc")) {
                    sort = Sort.by(columnName).ascending();
                } else {
                    sort = Sort.by(columnName).descending();
                }
            }
        }

        List<String> storeList;
        if(!StringUtils.hasLength(storeId)){
            storeList = CurrentUserDetails.getCurrentStores();
        }else{
            String[] list = storeId.split(" ");
            storeList = Arrays.stream(list).toList();
        }

        Pageable pageable = PageRequest.of(p, pageSize, sort);
        Page<Package> data = packageRepository.findPackages(storeList, quantity, name, pageable);
        List<PackageDTO> dtos = data.stream().map(packageConverter::toPackageDTO).toList();

        return PageResponse.<PackageDTO>builder()
                .data(dtos)
                .pageSize(pageSize)
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalPages((long) data.getTotalPages())
                .build();
    }

    @Override
    public void createPackage(PackageCreationRequest request) {
        if(packageRepository.existsByName(request.getName().trim())){
            throw new AppException(ErrorCode.PACKAGE_EXISTED);
        }
        Package pack = packageConverter.toPackageEntity(request);
        pack.setStore(storeRepository.getReferenceById(request.getStoreId()));
        packageRepository.save(pack);
    }
}
