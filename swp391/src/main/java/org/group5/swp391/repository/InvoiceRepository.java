package org.group5.swp391.repository;

import org.group5.swp391.entity.Customer;
import org.group5.swp391.entity.Invoice;
import org.group5.swp391.entity.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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



}