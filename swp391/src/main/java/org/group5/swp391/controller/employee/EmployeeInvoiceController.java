package org.group5.swp391.controller.employee;


import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.employee.EmployeeInvoiceDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/employee")
@RequiredArgsConstructor
public class EmployeeInvoiceController {

    @GetMapping("invoices")
    public Page<EmployeeInvoiceDTO> getEmployeeInvoices () {
        return null;
    }



}
