package org.group5.swp391.service;

import org.group5.swp391.dto.debt.DebtCreationRequest;
import org.group5.swp391.dto.debt.DebtDTO;
import org.group5.swp391.dto.response.PageResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public interface DebtService {
    public String createDebt(DebtCreationRequest request);
    public PageResponse<DebtDTO> searchForDebt(int pageNo, int pageSize, String sortBy, List<String> storeId,
                                               LocalDate startCreatedAt, LocalDate endCreatedAt, String customerName,
                                               String phoneNumber, String email , String address, Double fromAmount, Double toAmount);
}
