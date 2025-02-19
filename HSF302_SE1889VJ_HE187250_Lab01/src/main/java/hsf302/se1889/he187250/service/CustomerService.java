package hsf302.se1889.he187250.service;

import hsf302.se1889.he187250.converter.CustomerConverter;
import hsf302.se1889.he187250.dto.CustomerDTO;
import hsf302.se1889.he187250.entity.Customer;
import hsf302.se1889.he187250.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerConverter customerConverter;

    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAllCustomers().stream().map(customerConverter::convertToDTO).toList();
    }
}