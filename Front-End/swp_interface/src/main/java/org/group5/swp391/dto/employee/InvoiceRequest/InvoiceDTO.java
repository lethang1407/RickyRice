package org.group5.swp391.dto.employee.InvoiceRequest;


import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class InvoiceDTO {
    private String id;
    private String customerPhone;
    private String customerName;
    private double totalAmount;
    private double totalShipping;
    private String description;
    private boolean type;
    private Long created_at;
    private Long updated_at;
}
