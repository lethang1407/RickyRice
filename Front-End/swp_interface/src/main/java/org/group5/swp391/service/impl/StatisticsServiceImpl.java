package org.group5.swp391.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.group5.swp391.converter.StatisticsConverter;
import org.group5.swp391.dto.store_owner.all_statistic.StoreStatisticDTO;
import org.group5.swp391.dto.store_owner.all_statistic.StoreStatisticDataDTO;
import org.group5.swp391.entity.Account;
import org.group5.swp391.entity.Statistics;
import org.group5.swp391.entity.Store;
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
    @Override
    public Page<StoreStatisticDTO> getStatistics(String storeName, Double totalMoneyMin, Double totalMoneyMax,
                                                 String description, String strType, LocalDate createdAtStart,
                                                 LocalDate createdAtEnd, String createdBy, int page, int size,
                                                 String sortBy, boolean descending) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn chưa đăng nhập!");
        }
        String username = authentication.getName();
        List<String> storeIds = storeRepository.findIdsByUserName(username);
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        description = (description != null && description.isEmpty()) ? null : description;
        Boolean type = strType.equals("all") ? null : strType.equals("paid");
        LocalDateTime startDateTime = (createdAtStart != null) ? createdAtStart.atStartOfDay() : null;
        LocalDateTime endDateTime = (createdAtEnd != null) ? createdAtEnd.atTime(LocalTime.MAX) : null;
        Page<Statistics> statisticsPage = statisticsRepository.findStatisticsByStores(
                storeIds, storeName, totalMoneyMin, totalMoneyMax, description, type,
                startDateTime, endDateTime, createdBy, pageable
        );
        return statisticsPage.map(statisticsConverter::toStoreStatisticDTO);
    }

    @Override
    public Map<String, Map<String, Double>> getStatisticsByDescription(LocalDate createdAtStart, LocalDate createdAtEnd, List<String> storeIds) {
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
        List<Statistics> statisticsList = statisticsRepository.findStatisticsByDescription(storeIds, startDateTime, endDateTime, null);
        return statisticsList.stream()
                .collect(Collectors.groupingBy(
                        stat -> stat.getCreatedAt().toLocalDate().toString(),
                        Collectors.groupingBy(
                                stat -> stat.getDescription() != null ? stat.getDescription() : "Unknown",
                                Collectors.summingDouble(Statistics::getTotalMoney)
                        )
                ));
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
                                stat -> stat.getType() != null && stat.getType() ? "Thanh Toán" : "Nợ",
                                Collectors.summingDouble(Statistics::getTotalMoney)
                        )
                ));
    }

    public StoreStatisticDataDTO getStatisticTransactionsByStores(List<String> storeIds){
        int totalEmployees = employeeRepository.countByStoreIdIn(storeIds);
        int totalProducts = productRepository.countByStoreIdIn(storeIds);
        int totalTransactions = statisticsRepository.countByStoreIdIn(storeIds);
        double totalImport = statisticsRepository.getTotalImport(storeIds);
        double totalExport = statisticsRepository.getTotalExport(storeIds);
        return new StoreStatisticDataDTO(totalEmployees,totalProducts, totalTransactions, totalImport, totalExport);
    }
}