package org.group5.swp391.repository;

import org.group5.swp391.entity.Debt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface DebtRepository extends JpaRepository<Debt, String> {
    @Query("""
    SELECT d FROM Debt d 
    WHERE ( d.store.id IN (:storeId))
      AND (:startCreatedAt IS NULL OR d.createdAt >= :startCreatedAt)
      AND (:endCreatedAt IS NULL OR d.createdAt <= :endCreatedAt)
      AND (:customerName IS NULL OR LOWER(d.customer.name) LIKE LOWER(CONCAT('%', :customerName, '%')))
      AND (:phoneNumber IS NULL OR d.customer.phoneNumber LIKE CONCAT('%', :phoneNumber, '%'))
      AND (:email IS NULL OR LOWER(d.customer.email) LIKE LOWER(CONCAT('%', :email, '%')))
      AND (:address IS NULL OR LOWER(d.customer.address) LIKE LOWER(CONCAT('%', :address, '%')))
      AND (:fromAmount IS NULL OR d.amount >= :fromAmount)
      AND (:toAmount IS NULL OR d.amount <= :toAmount)
""")
    Page<Debt> searchForDebt(
            @Param("storeId") List<String> storeId,
            @Param("startCreatedAt") LocalDateTime startCreatedAt,
            @Param("endCreatedAt") LocalDateTime endCreatedAt,
            @Param("customerName") String customerName,
            @Param("phoneNumber") String phoneNumber,
            @Param("email") String email,
            @Param("address") String address,
            @Param("fromAmount") Double fromAmount,
            @Param("toAmount") Double toAmount,
            Pageable pageable
    );

}
