package org.group5.swp391.dto.employee;


import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeInvoiceDetailDTO {
    private String invoiceDetailID;
    private long quantity;
    private int discount;
    private String productName;
    private String productInformation;
    private String productImage;
    private double productPrice;
    private String productCategoryName;
    private String productCategoryDescription;
}
