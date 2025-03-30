package org.group5.swp391.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.group5.swp391.converter.StatisticsConverter;
import org.group5.swp391.dto.store_owner.all_statistic.StoreStatisticDTO;
import org.group5.swp391.dto.store_owner.all_statistic.StoreStatisticDataDTO;
import org.group5.swp391.entity.Account;
import org.group5.swp391.entity.Debt;
import org.group5.swp391.entity.Statistics;
import org.group5.swp391.entity.Store;
import org.group5.swp391.enums.DebtType;
import org.group5.swp391.repository.*;
import org.group5.swp391.service.StatisticsService;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Slf4j
@Service
@RequiredArgsConstructor
public class StatisticsServiceImpl implements StatisticsService {
    private final StatisticsRepository statisticsRepository;
    private final StatisticsConverter statisticsConverter;
    private final AccountRepository accountRepository;
    private final StoreRepository storeRepository;
    private final EmployeeRepository employeeRepository;
    private final ProductRepository productRepository;
    private final DebtRepository debtRepository;

    @Override
    public Page<StoreStatisticDTO> getStatistics(List<String> storeIds, Double totalMoneyMin, Double totalMoneyMax,
                                                 String strType, LocalDate createdAtStart,
                                                 LocalDate createdAtEnd, String createdBy, int page, int size,
                                                 String sortBy, boolean descending) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        if (storeIds != null && storeIds.isEmpty()) {
            storeIds = null;
        }
        Boolean type = strType.equals("all") ? null : strType.equalsIgnoreCase("export");
        LocalDateTime startDateTime = (createdAtStart != null) ? createdAtStart.atStartOfDay() : null;
        LocalDateTime endDateTime = (createdAtEnd != null) ? createdAtEnd.atTime(LocalTime.MAX) : null;
        Page<Statistics> statisticsPage = statisticsRepository.findStatisticsByStores(
                storeIds, username, totalMoneyMin, totalMoneyMax, type,
                startDateTime, endDateTime, createdBy, pageable
        );
        return statisticsPage.map(statisticsConverter::toStoreStatisticDTO);
    }

    @Override
    public Map<String, Map<String, Double>> getStatisticsByType(LocalDate createdAtStart, LocalDate createdAtEnd, List<String> storeIds) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        if (storeIds == null || storeIds.isEmpty() || storeIds.contains("all")) {
            storeIds = storeRepository.findIdsByUserName(username);
        }
        LocalDateTime startDateTime = createdAtStart != null ? createdAtStart.atStartOfDay() : null;
        LocalDateTime endDateTime = createdAtEnd != null ? createdAtEnd.atTime(LocalTime.MAX) : null;
        List<Statistics> statisticsList = statisticsRepository.findStatisticsByType(storeIds, startDateTime, endDateTime, null);
        return statisticsList.stream()
                .collect(Collectors.groupingBy(
                        stat -> stat.getCreatedAt().toLocalDate().toString(),
                        Collectors.groupingBy(
                                stat -> stat.getType() != null && stat.getType() ? "Export" : "Import",
                                Collectors.summingDouble(Statistics::getTotalMoney)
                        )
                ));
    }

    @Override
    public Map<String, Map<String, Double>> getStatisticsByDebtOfKH(LocalDate createdAtStart, LocalDate createdAtEnd, List<String> storeIds) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        if (storeIds == null || storeIds.isEmpty() || storeIds.contains("all")) {
            storeIds = storeRepository.findIdsByUserName(username);
        }
        LocalDateTime startDateTime = createdAtStart != null ? createdAtStart.atStartOfDay() : null;
        LocalDateTime endDateTime = createdAtEnd != null ? createdAtEnd.atTime(LocalTime.MAX) : null;
        List<Debt> debtList = debtRepository.findDebtOfKHByTime(storeIds, startDateTime, endDateTime);
        return debtList.stream()
                .collect(Collectors.groupingBy(
                        stat -> stat.getCreatedAt().toLocalDate().toString(),
                        Collectors.groupingBy(
                                stat -> stat.getType() == DebtType.POSITIVE_KH_TRA ? "Khách hàng Trả" : "Khách hàng Vay",
                                Collectors.summingDouble(Debt::getAmount)
                        )
                ));
    }

    @Override
    public Map<String, Map<String, Double>> getStatisticsByDebtOfCH(LocalDate createdAtStart, LocalDate createdAtEnd, List<String> storeIds) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        if (storeIds == null || storeIds.isEmpty() || storeIds.contains("all")) {
            storeIds = storeRepository.findIdsByUserName(username);
        }
        LocalDateTime startDateTime = createdAtStart != null ? createdAtStart.atStartOfDay() : null;
        LocalDateTime endDateTime = createdAtEnd != null ? createdAtEnd.atTime(LocalTime.MAX) : null;
        List<Debt> debtList = debtRepository.findDebtOfCHByTime(storeIds, startDateTime, endDateTime);

        return debtList.stream()
                .collect(Collectors.groupingBy(
                        stat -> stat.getCreatedAt().toLocalDate().toString(),
                        Collectors.groupingBy(
                                stat -> stat.getType() == DebtType.NEGATIVE_CH_TRA ? "Cửa hàng Trả" : "Cửa hàng Vay",
                                Collectors.summingDouble(Debt::getAmount)
                        )
                ));
    }

    public StoreStatisticDataDTO getStatisticTransactionsByStores(List<String> storeIds) {
        int totalEmployees = 0;
        int totalProducts = 0;
        int totalTransactions = 0;
        double totalImport = 0;
        double totalExport = 0;
        double totalDebtOfKH = 0;
        double totalDebtOfCH = 0;
        try {
            totalEmployees = employeeRepository.countByStoreIdIn(storeIds);
            totalProducts = productRepository.countByStoreIdIn(storeIds);
            totalTransactions = statisticsRepository.countByStoreIdIn(storeIds);
            totalImport = statisticsRepository.getTotalImport(storeIds);
            totalExport = statisticsRepository.getTotalExport(storeIds);
            totalDebtOfKH = debtRepository.getTotalDebtByKH_NO(storeIds);
            totalDebtOfCH = debtRepository.getTotalDebtByCH_NO(storeIds);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return new StoreStatisticDataDTO(totalEmployees, totalProducts, totalTransactions, totalImport, totalExport, totalDebtOfKH, totalDebtOfCH);
    }
}