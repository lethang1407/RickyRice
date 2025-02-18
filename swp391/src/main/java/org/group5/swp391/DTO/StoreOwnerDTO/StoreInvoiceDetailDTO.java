package org.group5.swp391.DTO.StoreOwnerDTO;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class StoreInvoiceDetailDTO {
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
