package org.group5.swp391.controller.employee;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.employee.InvoiceRequest.InvoiceDetailDTO;
import org.group5.swp391.service.impl.InvoiceDetailServiceImpl;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class EmployeeInvoiceDetailController {
    private final InvoiceDetailServiceImpl invoiceDetailService;

    @GetMapping("/employee/invoice-detail")
    public List<InvoiceDetailDTO> getInvoiceDetails(@RequestParam String invoiceId) {
        invoiceId = invoiceId.trim();
        System.out.println(invoiceId.length());
            return invoiceDetailService.getInvoiceDetailsByInvoiceId(invoiceId);
    }
}
