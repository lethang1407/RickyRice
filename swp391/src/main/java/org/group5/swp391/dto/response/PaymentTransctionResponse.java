package org.group5.swp391.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class PaymentTransctionResponse {
    Double vnpAmount;
    String vnpResponseCode;
    String vnpOrderInfo;
    String vnpTransactionNo;
    String vnp_TxnRef;
}
