package org.group5.swp391.DTO.StoreOwnerDTO;

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
}