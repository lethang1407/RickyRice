package hsf302.se1889.he187250.converter;

import hsf302.se1889.he187250.dto.CustomerDTO;
import hsf302.se1889.he187250.entity.Customer;
import org.springframework.stereotype.Component;

@Component
public class CustomerConverter {

    // Convert Customer entity to CustomerDTO
    public CustomerDTO convertToDTO(Customer customer) {
        if (customer == null) {
            return null;
        }
        return new CustomerDTO(
                customer.getCustomerId(),
                customer.getCustomerName(),
                customer.getEmail(),
                customer.getAddress(),
                customer.getRegisterDate(),
                customer.getAccountBalance()
        );
    }
}