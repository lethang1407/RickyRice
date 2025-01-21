package org.group5.swp391.DTO.Response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AccountResponse {
    private String username;
    private String email;
    private String phoneNumber;
    private String avatar;
    private LocalDateTime createdAt;
    private Boolean isActive;
    private Boolean gender;
    private LocalDateTime birthDate;

    // Constructor
    public AccountResponse(String username, String email, String phoneNumber, String avatar,
                           LocalDateTime createdAt, Boolean isActive, Boolean gender, LocalDateTime birthDate) {
        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.avatar = avatar;
        this.createdAt = createdAt;
        this.isActive = isActive;
        this.gender = gender;
        this.birthDate = birthDate;
    }
}
