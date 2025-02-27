package org.group5.swp391.repository;

import org.group5.swp391.entity.Invoice;
import org.group5.swp391.entity.InvoiceDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceDetailRepository extends JpaRepository<InvoiceDetail, String> {
    List<InvoiceDetail> findByInvoice(Invoice invoice);
}
