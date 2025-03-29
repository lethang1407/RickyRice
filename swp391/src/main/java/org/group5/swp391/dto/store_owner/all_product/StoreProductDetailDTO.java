package org.group5.swp391.dto.store_owner.all_product;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreProductDetailDTO {

    @NotBlank(message = "Mã sản phẩm không được để trống")
    String productID;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 200, message = "Tên sản phẩm không được vượt quá 200 ký tự")
    String name;

    @NotNull(message = "Giá sản phẩm không được để trống")
    @Min(value = 1, message = "Giá sản phẩm phải lớn hơn hoặc bằng 1")
    @Max(value = 1000000000, message = "Giá sản phẩm không được vượt quá 1 tỷ")
    double price;

    @Size(max = 200, message = "Thông tin sản phẩm không được vượt quá 200 ký tự")
    String information;

    @NotNull(message = "Danh mục sản phẩm không được để trống")
    StoreCategoryIdAndNameDTO category;

    String productImage;

    @NotNull(message = "Cửa hàng không được để trống")
    StoreInfoIdAndNameDTO store;

    @NotNull(message = "Thuộc tính sản phẩm không được để trống")
    List<StoreProductAttributeDTO> attributes;

    Long quantity;

    @NotNull(message = "Khu vực lưu trữ không được để trống")
    List<StoreZoneIdAndNameDTO> zones;
}
