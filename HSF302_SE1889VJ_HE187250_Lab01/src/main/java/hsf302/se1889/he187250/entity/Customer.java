package hsf302.se1889.he187250.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Customer_ID")
    private int customerId;

    @NotBlank(message = "Customer Name is required")
    @Size(max = 50, message = "Customer Name cannot exceed 50 characters")
    @Column(name = "Customer_Name", nullable = false, length = 50)
    private String customerName;

    @NotBlank(message = "Status is required")
    @Size(max = 20, message = "Status cannot exceed 20 characters")
    @Column(name = "Status", nullable = false, length = 20)
    private String status;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 50, message = "Email cannot exceed 50 characters")
    @Column(name = "Email", nullable = false, length = 50)
    private String email;

    @NotBlank(message = "Address is required")
    @Size(max = 100, message = "Address cannot exceed 100 characters")
    @Column(name = "Address", nullable = false, length = 100)
    private String address;

    @NotNull(message = "Register Date is required")
    @Column(name = "Register_Date", nullable = false)
    private LocalDateTime registerDate;

    @NotNull(message = "Account Balance is required")
    @PositiveOrZero(message = "Account Balance must be zero or a positive number")
    @Digits(integer = 19, fraction = 1, message = "Account Balance must not exceed 19 digits with 1 decimal point")
    @Column(name = "Account_Balance", nullable = false, precision = 19, scale = 1)
    private BigDecimal accountBalance;

    @NotBlank(message = "Password is required")
    @Size(max = 20, message = "Password cannot exceed 20 characters")
    @Column(name = "Password", nullable = false, length = 20)
    private String password;

}