package org.group5.swp391.dto.store_owner;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreInvoiceDTO {
    String invoiceID;
    Double productMoney;
    Double shipMoney;
    Double totalMoney;
    String description;
    Boolean type;
    Boolean status;
    String customerName;
    String customerPhoneNumber;
    String storeName;

    public void calculateTotalMoney() {
        this.totalMoney = (productMoney != null ? productMoney : 0) + (shipMoney != null ? shipMoney : 0);
    }
}