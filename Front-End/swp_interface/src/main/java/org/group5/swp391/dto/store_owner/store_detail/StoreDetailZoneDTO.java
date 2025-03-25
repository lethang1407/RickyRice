package org.group5.swp391.dto.store_owner.store_detail;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreDetailZoneDTO {

    @JsonInclude()
    String id;

    @NotBlank(message = "Tên khu không được để trống")
    @Size(max = 100, message = "Tên khu không được vượt quá 100 ký tự")
    String name;

    @NotBlank(message = "Vị trí không được để trống")
    @Size(max = 50, message = "Vị trí không được vượt quá 50 ký tự")
    String location;

    @NotBlank(message = "ID cửa hàng không được để trống")
    String storeID;

    @NotBlank(message = "ID sản phẩm không được để trống")
    String productID;

    @JsonInclude
    String productName;

    @JsonInclude
    Long productQuantity;

    @JsonInclude
    String productInformation;

    @JsonInclude
    String createdBy;

    String updatedBy;

    @JsonInclude
    LocalDateTime createdAt;

    @JsonInclude
    LocalDateTime updatedAt;

}