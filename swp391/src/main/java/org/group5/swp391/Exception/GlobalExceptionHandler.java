package org.group5.swp391.Exception;

import org.group5.swp391.DTO.Response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.security.sasl.AuthenticationException;
import java.io.EOFException;
import java.text.ParseException;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse> hanldeRuntimeException(RuntimeException e) {
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage(e.getMessage());
        apiResponse.setCode(400);
        return ResponseEntity.status(400).body(apiResponse);
    }

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse> hanldeAppException(AppException e) {
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage(e.getErrorCode().getMessage());
        apiResponse.setCode(e.getErrorCode().getCode());
        return ResponseEntity.status(e.getErrorCode().getHttpStatusCode()).body(apiResponse);
    }


    @ExceptionHandler(ParseException.class)
    public ResponseEntity<ApiResponse> hanldeParseException(ParseException e) {
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setMessage(e.getMessage());
        apiResponse.setCode(400);
        return ResponseEntity.status(400).body(apiResponse);
    }

    @ExceptionHandler(EOFException.class)
    public ResponseEntity<ApiResponse> hanldeEOFException(EOFException e) {
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setMessage(e.getMessage());
        apiResponse.setCode(400);
        return ResponseEntity.status(400).body(apiResponse);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse> hanldeAuthenticationException(AuthenticationException e) {
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setMessage(e.getMessage());
        apiResponse.setCode(401);
        return ResponseEntity.status(401).body(apiResponse);
    }

}
