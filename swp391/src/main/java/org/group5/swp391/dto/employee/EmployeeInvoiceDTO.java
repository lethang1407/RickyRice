package org.group5.swp391.dto.employee;


import jakarta.validation.constraints.*;
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
    @NotNull(message = "Tiền sản phẩm không được để trống")
    Double productMoney;
    @NotNull(message = "Tiền giao hàng không được để trống")
    Double shipMoney;
    Double totalMoney;
    @Size(max = 100, message = "Mô tả không được vượt quá 255 ký tự")
    String description;
    @NotNull(message = "Loại hóa đơn (type) không được để trống")
    Boolean type;
    @NotNull(message = "Trạng thái (status) không được để trống")
    Boolean status;
    @NotBlank(message = "Tên khách hàng không được để trống")
    String customerName;
    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Số điện thoại chỉ được chứa từ 10-15 chữ số")
    String customerPhoneNumber;
    @NotBlank(message = "Tên cửa hàng không được để trống")
    String storeName;
    public void calculateTotalMoney() {
        this.totalMoney = (productMoney != null ? productMoney : 0) + (shipMoney != null ? shipMoney : 0);
    }
}
