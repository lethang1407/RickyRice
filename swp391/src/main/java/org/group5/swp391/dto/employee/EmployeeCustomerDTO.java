package org.group5.swp391.dto.employee;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
public class EmployeeCustomerDTO {

    String customerID;
    @NotBlank(message = "Tên không được để trống")
    @Size(min = 1, max = 50, message = "Tên phải có từ 3-50 ký tự")
    String name;
    @NotBlank(message = "Số điện thoại không được để trống")
    @Size(min = 10, max = 15, message = "Số điện thoại phải có từ 10-15 ký tự")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Số điện thoại chỉ được chứa từ 10-15 chữ số")
    String phoneNumber;
    @Size(max =100, message = "địa chỉ cần rút ngắn gọn lại")
    String address;
    @Email(message = "Email không hợp lệ")
    String email;
    Long created_at;
    Long updated_at;
    String created_by;
    Double balance;
    EmployeeStoreDTO employeeStoreDTO;

    public EmployeeCustomerDTO(String customerID, String name, String phoneNumber) {
        this.customerID = customerID;
        this.name = name;
        this.phoneNumber = phoneNumber;
    }
}
