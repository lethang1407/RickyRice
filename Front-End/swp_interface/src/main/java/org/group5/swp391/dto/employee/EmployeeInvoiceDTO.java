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
public class EmployeeInvoiceDTO {
    String id;
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
