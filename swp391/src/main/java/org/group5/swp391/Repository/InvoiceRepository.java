package org.group5.swp391.Repository;

import org.group5.swp391.Entity.Customer;
import org.group5.swp391.Entity.Invoice;
import org.group5.swp391.Entity.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;


public interface InvoiceRepository extends JpaRepository<Invoice, String> {
    Page<Invoice> findByStoreInAndCustomerIn(Collection<Store> stores, Collection<Customer> customers, Pageable pageable);
    Page<Invoice> findAll(Pageable pageable);
}