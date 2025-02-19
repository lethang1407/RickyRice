package hsf302.se1889.he187250.repository;

import hsf302.se1889.he187250.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    List<Customer> findAllCustomers();
}
