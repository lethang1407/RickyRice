package org.group5.swp391.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor // Tạo constructor với tất cả tham số
public class AccountResponse {
    private String accountID;
    private String username;
    private String email;
    private String phoneNumber;
    private String avatar;
    private LocalDateTime createdAt;
    private Boolean isActive;
    private Boolean gender;
    private LocalDateTime birthDate;

}
