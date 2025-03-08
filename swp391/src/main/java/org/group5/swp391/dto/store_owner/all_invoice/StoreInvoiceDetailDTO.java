package org.group5.swp391.dto.store_owner.all_invoice;

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
