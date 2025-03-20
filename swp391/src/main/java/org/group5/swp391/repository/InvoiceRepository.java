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


public interface InvoiceRepository extends JpaRepository<Invoice, String> {

    @Query("""
    SELECT i FROM Invoice i 
    WHERE i.store IN :stores 
      AND i.customer IN :customers
      AND (:type IS NULL OR i.type = :type) 
      AND (:status IS NULL OR i.status = :status)
""")
    Page<Invoice> findInvoices(
            @Param("stores") Collection<Store> stores,
            @Param("customers") Collection<Customer> customers,
            @Param("type") Boolean type,
            @Param("status") Boolean status,
            Pageable pageable
    );

    Page<Invoice> findByStoreIn(Collection<Store> stores, Pageable pageable);
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