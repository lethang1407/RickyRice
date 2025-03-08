package org.group5.swp391.repository;

import org.group5.swp391.entity.Customer;
import org.group5.swp391.entity.Invoice;
import org.group5.swp391.entity.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;


public interface InvoiceRepository extends JpaRepository<Invoice, String> {
    Page<Invoice> findByStoreInAndCustomerInAndTypeAndStatus(Collection<Store> stores, Collection<Customer> customers, Boolean type, Boolean status, Pageable pageable);
    Page<Invoice> findByStoreIn(Collection<Store> stores, Pageable pageable);



}