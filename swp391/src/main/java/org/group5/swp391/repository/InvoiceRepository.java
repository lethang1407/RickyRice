package org.group5.swp391.repository;

import org.group5.swp391.entity.Customer;
import org.group5.swp391.entity.Invoice;
import org.group5.swp391.entity.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;


public interface InvoiceRepository extends JpaRepository<Invoice, String> {

    @Query("""
    SELECT i FROM Invoice i
    JOIN i.store s
    JOIN s.storeAccount sa
    WHERE (:invoiceId IS NULL OR i.id = :invoiceId)
      AND (:customerName IS NULL OR LOWER(i.customer.name) LIKE LOWER(CONCAT('%', :customerName, '%')))
      AND (:phoneNumber IS NULL OR LOWER(i.customer.phoneNumber) LIKE LOWER(CONCAT('%', :phoneNumber, '%')))
      AND (:totalMoneyMin IS NULL OR (i.shipMoney + i.productMoney) >= :totalMoneyMin)
      AND (:totalMoneyMax IS NULL OR (i.shipMoney + i.productMoney) <= :totalMoneyMax)
      AND (:type IS NULL OR i.type = :type)
      AND (:status IS NULL OR i.status = :status)
      AND (:storeIds IS NULL OR s.id IN (:storeIds))
      AND sa.username = :username
""")
    Page<Invoice> findInvoices(
            @Param("invoiceId") String invoiceId,
            @Param("customerName") String customerName,
            @Param("phoneNumber") String phoneNumber,
            @Param("totalMoneyMin") Double totalMoneyMin,
            @Param("totalMoneyMax") Double totalMoneyMax,
            @Param("type") Boolean type,
            @Param("status") Boolean status,
            @Param("storeIds") List<String> storeIds,
            @Param("username") String username,
            Pageable pageable
    );

    @Query("SELECT c FROM Invoice c " +
            "WHERE c.store.id = :storeId " +
            "AND (:customerPhone IS NULL OR c.customer.phoneNumber LIKE %:customerPhone%) " +
            "AND (:name IS NULL OR c.customer.name LIKE %:name%) " +
            "AND (:minAmount IS NULL OR c.productMoney >= :minAmount) " +
            "AND (:maxAmount IS NULL OR c.productMoney <= :maxAmount) " +
            "AND (:minShipping IS NULL OR c.shipMoney >= :minShipping) " +
            "AND (:maxShipping IS NULL OR c.shipMoney <= :maxShipping) " +
            "AND (:startDate IS NULL OR c.createdAt >= :startDate) " +
            "AND (:endDate IS NULL OR c.createdAt <= :endDate)")
    Page<Invoice> findInvoiceByCustomerPhone(
            @Param("customerPhone") String customerPhone,
            @Param("name") String name,
            @Param("storeId") String storeId,
            @Param("minAmount") Long minAmount,
            @Param("maxAmount") Long maxAmount,
            @Param("minShipping") Long minShipping,
            @Param("maxShipping") Long maxShipping,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

}