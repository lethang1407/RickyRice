package org.group5.swp391.dto.employee.InvoiceRequest;


import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class InvoiceDetailDTO {
    private String Id;
    private String productID;
    private String packageId;
    private long quantity;
    private double price;
    private int discount;
    private String productName;
    private String productInformation;
    private String productImage;
}
