package hsf302.se1889.he187250.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CustomerDTO {

    private int customerId;
    private String customerName;
    private String email;
    private String address;
    private LocalDateTime registerDate;
    private BigDecimal accountBalance;

    public CustomerDTO() {
    }

    public CustomerDTO(int customerId, String customerName, String email, String address, LocalDateTime registerDate, BigDecimal accountBalance) {
        this.customerId = customerId;
        this.customerName = customerName;
        this.email = email;
        this.address = address;
        this.registerDate = registerDate;
        this.accountBalance = accountBalance;
    }

}