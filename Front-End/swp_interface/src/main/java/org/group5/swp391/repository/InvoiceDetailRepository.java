package org.group5.swp391.repository;

import org.group5.swp391.entity.Invoice;
import org.group5.swp391.entity.InvoiceDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface InvoiceDetailRepository extends JpaRepository<InvoiceDetail, String> {
    List<InvoiceDetail> findByInvoice(Invoice invoice);
    @Query("select i from InvoiceDetail i where i.invoice.id = :invoiceId")
    List<InvoiceDetail> findByInvoiceId(@Param("invoiceId") String invoiceId);
}
