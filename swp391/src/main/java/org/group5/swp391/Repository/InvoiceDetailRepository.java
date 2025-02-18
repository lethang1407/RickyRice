package org.group5.swp391.Repository;

import org.group5.swp391.Entity.Invoice;
import org.group5.swp391.Entity.InvoiceDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceDetailRepository extends JpaRepository<InvoiceDetail, String> {
    List<InvoiceDetail> findByInvoice(Invoice invoice);
}
