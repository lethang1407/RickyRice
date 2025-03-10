package org.group5.swp391.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.DebtConverter;
import org.group5.swp391.dto.debt.DebtCreationRequest;
import org.group5.swp391.dto.debt.DebtDTO;
import org.group5.swp391.dto.notification.SendNotificationRequest;
import org.group5.swp391.dto.response.PageResponse;
import org.group5.swp391.entity.Customer;
import org.group5.swp391.entity.Debt;
import org.group5.swp391.entity.Store;
import org.group5.swp391.enums.DebtType;
import org.group5.swp391.enums.Status;
import org.group5.swp391.exception.AppException;
import org.group5.swp391.exception.ErrorCode;
import org.group5.swp391.repository.CustomerRepository;
import org.group5.swp391.repository.DebtRepository;
import org.group5.swp391.repository.StoreRepository;
import org.group5.swp391.service.DebtService;
import org.group5.swp391.service.NotificationService;
import org.group5.swp391.utils.CurrentUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class DebtServiceImpl implements DebtService {
    private final CustomerRepository customerRepository;
    private final StoreRepository storeRepository;
    private final DebtRepository debtRepository;
    private final DebtConverter debtConverter;
    private final NotificationService notificationService;

    @Transactional
    @Override
    public String createDebt(DebtCreationRequest request) {
        Debt debt = debtConverter.toDebtEntity(request);

        Customer customer = customerRepository.findById(request.getCustomerId()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        debt.setCustomer(customer);

        Store store = storeRepository.getReferenceById(customer.getStore().getId());
        debt.setStore(store);

        debt.setCreatedBy(request.getCreatedBy());

        debt.setStatus(Status.DONE);

        debt.setNumber(generateDebtNumber(request));

        debtRepository.save(debt);

        if(debt.getType().equals(DebtType.POSITIVE)){
            customer.setBalance(customer.getBalance() + debt.getAmount());
        }else{
            customer.setBalance(customer.getBalance() - debt.getAmount());
        }

        SendNotificationRequest notificationRequest = SendNotificationRequest.builder()
                .targetUsername(request.getCreatedBy())
                .message("Đã xử lý xong phiếu nợ của KH: "+ customer.getName() +". Vui lòng check lại thông tin trong phiếu nợ!")
                .build();

        notificationService.sendNotification(notificationRequest);

        return debt.getNumber();
    }

    @Override
    public PageResponse<DebtDTO> searchForDebt(int pageNo, int pageSize, String sortBy, String storeId, String number, String type ,
                                               LocalDate startCreatedAt, LocalDate endCreatedAt, String customerName,
                                               String phoneNumber, String email, String address, Double fromAmount, Double toAmount, String createdBy) {

        Sort sort = Sort.by("number").descending();

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
        Page<Debt> debts = debtRepository.searchForDebt( storeList, number, StringUtils.hasLength(type) ? DebtType.valueOf(type) : null, startCreatedAt!=null ? startCreatedAt.atStartOfDay() : null,
                endCreatedAt!=null ? endCreatedAt.atTime(23, 59, 59) : null, customerName,
                phoneNumber, email, address, fromAmount, toAmount, createdBy ,pageable);

        List<DebtDTO> dtos = debts.stream().map(debtConverter::toDto).toList();

        return PageResponse.<DebtDTO>builder()
                .data(dtos)
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalPages((long) debts.getTotalPages())
                .build();
    }

    private String generateDebtNumber(DebtCreationRequest request){
        StringBuilder debtNumber = new StringBuilder("DEBT_");
        long millis = System.currentTimeMillis();
        debtNumber.append(millis).append("_");
        debtNumber.append(request.getCustomerId()).append("_");
        debtNumber.append(request.getType());
        return debtNumber.toString();
    }
}
