package org.group5.swp391.repository;

import org.group5.swp391.entity.Debt;
import org.group5.swp391.entity.Statistics;
import org.group5.swp391.enums.DebtType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DebtRepository extends JpaRepository<Debt, String> {
    @Query("""
    SELECT d FROM Debt d 
    WHERE ( d.store.id IN (:storeId))
      AND (:number IS NULL OR TRIM(:number) <> '' AND LOWER(d.number) LIKE LOWER(CONCAT('%', :number, '%')))
      AND (:type IS NULL OR d.type = :type)
      AND (:startCreatedAt IS NULL OR d.createdAt >= :startCreatedAt)
      AND (:endCreatedAt IS NULL OR d.createdAt <= :endCreatedAt)
      AND (:customerName IS NULL OR TRIM(:customerName) <> '' AND LOWER(d.customer.name) LIKE LOWER(CONCAT('%', :customerName, '%')))
      AND (:phoneNumber IS NULL OR TRIM(:phoneNumber) <> '' AND d.customer.phoneNumber LIKE CONCAT('%', :phoneNumber, '%'))
      AND (:email IS NULL OR TRIM(:email) <> '' AND LOWER(d.customer.email) LIKE LOWER(CONCAT('%', :email, '%')))
      AND (:address IS NULL OR TRIM(:address) <> '' AND LOWER(d.customer.address) LIKE LOWER(CONCAT('%', :address, '%')))
      AND (:fromAmount IS NULL OR d.amount >= :fromAmount)
      AND (:toAmount IS NULL OR d.amount <= :toAmount)
      AND (:createdBy IS NULL OR TRIM(:createdBy) <> '' AND LOWER(d.createdBy) LIKE LOWER(CONCAT('%', :createdBy, '%')))
""")
    Page<Debt> searchForDebt(
            @Param("storeId") List<String> storeId,
            @Param("number") String number,
            @Param("type") DebtType type,
            @Param("startCreatedAt") LocalDateTime startCreatedAt,
            @Param("endCreatedAt") LocalDateTime endCreatedAt,
            @Param("customerName") String customerName,
            @Param("phoneNumber") String phoneNumber,
            @Param("email") String email,
            @Param("address") String address,
            @Param("fromAmount") Double fromAmount,
            @Param("toAmount") Double toAmount,
            @Param("createdBy") String createdBy,
            Pageable pageable
    );

    @Query("""
    SELECT d FROM Debt d 
    WHERE (:customerId IS NULL OR TRIM(:customerId) <> '' AND d.customer.id = :customerId )
      AND (:number IS NULL OR TRIM(:number) <> '' AND LOWER(d.number) LIKE LOWER(CONCAT('%', :number, '%')))
      AND (:type IS NULL OR d.type = :type)
      AND (:startCreatedAt IS NULL OR d.createdAt >= :startCreatedAt)
      AND (:endCreatedAt IS NULL OR d.createdAt <= :endCreatedAt)
      AND (:fromAmount IS NULL OR d.amount >= :fromAmount)
      AND (:toAmount IS NULL OR d.amount <= :toAmount)
      AND (:createdBy IS NULL OR TRIM(:createdBy) <> '' AND LOWER(d.createdBy) LIKE LOWER(CONCAT('%', :createdBy, '%')))
""")
    Page<Debt> searchForDetailCustomerDebt(
            @Param("customerId") String customerId,
            @Param("number") String number,
            @Param("type") DebtType type,
            @Param("startCreatedAt") LocalDateTime startCreatedAt,
            @Param("endCreatedAt") LocalDateTime endCreatedAt,
            @Param("fromAmount") Double fromAmount,
            @Param("toAmount") Double toAmount,
            @Param("createdBy") String createdBy,
            Pageable pageable
    );

    //Chien
    @Query("""
    SELECT d
    FROM Debt d
    WHERE d.store.id IN :storeIds
    AND (:createdAtStart IS NULL OR d.createdAt >= :createdAtStart)
    AND (:createdAtEnd IS NULL OR d.createdAt <= :createdAtEnd)
""")
    List<Debt> findDebtByTime(
            @Param("storeIds") List<String> storeIds,
            @Param("createdAtStart") LocalDateTime createdAtStart,
            @Param("createdAtEnd") LocalDateTime createdAtEnd
    );

    @Query("""
    SELECT SUM(d.amount)
    FROM Debt d
    WHERE d.store.id IN :storeIds
""")
    Double getTotalDebt(
            @Param("storeIds") List<String> storeIds
    );
}
