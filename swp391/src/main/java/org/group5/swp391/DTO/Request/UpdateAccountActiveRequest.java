package org.group5.swp391.DTO.Request;

import lombok.Data;

@Data
public class UpdateAccountActiveRequest {
    private String id;       // ID của tài khoản
    private Boolean isActive; // Trạng thái muốn cập nhật (true/false)
}
