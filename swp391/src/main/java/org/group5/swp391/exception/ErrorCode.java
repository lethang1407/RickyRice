package org.group5.swp391.exception;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    USER_EXISTED(400,"Người dùng đã tồn tại!", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(400,"Người dùng không tồn tại!",HttpStatus.NOT_FOUND),
    PASSWORD_INVALID(400,"Password must be at least 10",HttpStatus.BAD_REQUEST),
    KEY_INVALID(400,"Mã không hợp lệ!",HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(401,"Không có quyền truy cập!",HttpStatus.UNAUTHORIZED),
    FORBIDDEN(403,"Forbidden",HttpStatus.FORBIDDEN),
    NOT_FOUND(404,"Không tìm thấy!",HttpStatus.NOT_FOUND),
    UNCATEGORIZED(500,"Error not defined",HttpStatus.INTERNAL_SERVER_ERROR),
    PASSWORD_EXISTED(400,"Mật khẩu đã tồn tại!",HttpStatus.CONFLICT),
    EMAIL_EXISTED(400,"Email đã tồn tại!",HttpStatus.CONFLICT),
    USERNAME_EXISTED(400,"Tên đăng nhập đã tồn tại!",HttpStatus.CONFLICT),
    PHONENUMBER_EXISTED(400,"Số điện thoại đã tồn tại!",HttpStatus.CONFLICT),
    OTP_INVALID(400,"OTP không hợp lệ!",HttpStatus.CONFLICT),
    PRODUCT_NOT_FOUND(400,"Không tìm thấy sản phẩm!",HttpStatus.CONFLICT),
    USER_NOT_REGISTERED(400, "Người dùng chưa đăng kí!", HttpStatus.BAD_REQUEST),
    PHONENUMBER_INVALID(401,"SDT phải gồm 10 chữ số và bắt đầu bằng 0.",HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(402,"Email không đúng định dạng",HttpStatus.BAD_REQUEST),
    INVOICE_INVALID(403,"Tổng tiền hoặc phí vận chuyển không được < 0!",HttpStatus.BAD_REQUEST),
    CANT_GET_INFO(400,"Không thể lấy thông tin!",HttpStatus.CONFLICT),
    CANT_UPLOAD_IMAGE(400,"Can't upload image",HttpStatus.CONFLICT),
    PRODUCT_NAME_EXISTED(400,"Sản phẩm đã tồn tại!",HttpStatus.CONFLICT),
    PACKAGE_EXISTED(400, "Quy cách đóng gói đã tồn tại!", HttpStatus.BAD_REQUEST);
    ;
    private int code;
    private String message;
    private HttpStatusCode httpStatusCode;

    ErrorCode(int code, String message,HttpStatusCode httpStatusCode) {
        this.code = code;
        this.message = message;
        this.httpStatusCode = httpStatusCode;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public HttpStatusCode getHttpStatusCode() {
        return httpStatusCode;
    }

    public void setHttpStatusCode(HttpStatusCode httpStatusCode) {
        this.httpStatusCode = httpStatusCode;
    }
}
