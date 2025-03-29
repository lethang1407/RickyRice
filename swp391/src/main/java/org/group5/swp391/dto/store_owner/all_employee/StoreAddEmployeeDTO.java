package org.group5.swp391.dto.store_owner.all_employee;

import jakarta.validation.constraints.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.group5.swp391.utils.custom_constraint.PhoneConstraint;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@NotNull(message = "Dữ liệu nhân viên không được để trống")
public class StoreAddEmployeeDTO {

    @NotBlank(message = "Tên đăng nhập không được để trống")
    @Size(min = 3, max = 50, message = "Tên đăng nhập phải từ 3 đến 50 ký tự")
    String username;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, max = 100, message = "Mật khẩu phải từ 6 đến 100 ký tự")
    String password;

    @NotBlank(message = "Họ và tên không được để trống")
    @Size(min = 2, max = 100, message = "Họ và tên phải từ 2 đến 100 ký tự")
    String name;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    @Size(max = 100, message = "Email không được vượt quá 100 ký tự")
    String email;

    @NotBlank(message = "Số điện thoại không được để trống")
    @PhoneConstraint
    String phoneNumber;

    String avatar;

    @Past(message = "Ngày sinh phải là một ngày trong quá khứ")
    LocalDate birthDate;

    Integer gender;

    @NotBlank(message = "ID cửa hàng không được để trống")
    String storeId;
}
