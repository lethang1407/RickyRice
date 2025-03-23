package org.group5.swp391.service;

import org.group5.swp391.dto.debt.DebtCreationRequest;
import org.group5.swp391.dto.debt.DebtDTO;
import org.group5.swp391.dto.response.PageResponse;
import org.group5.swp391.enums.DebtType;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public interface DebtService {
    public String createDebt(DebtCreationRequest request);
    public PageResponse<DebtDTO> searchForDebt(int pageNo, int pageSize, String sortBy, String storeId, String number, String type,
                                               LocalDate startCreatedAt, LocalDate endCreatedAt, String customerName,
                                               String phoneNumber, String email , String address, Double fromAmount, Double toAmount, String createdBy);
    public PageResponse<DebtDTO> searchForDetailCustomerDebt(int pageNo, int pageSize, String sortBy,String customerId, String number,
                                                             String type, LocalDate startCreatedAt, LocalDate endCreatedAt,
                                                             Double fromAmount, Double toAmount, String createdBy);
}
