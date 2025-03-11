package org.group5.swp391.dto.employee.InvoiceRequest;

import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Data
@RequiredArgsConstructor
public class InvoiceRequest {
    private String employeeUsername;
    private InvoiceDTO invoice;
    private List<InvoiceDetailDTO> invoiceDetails;
}