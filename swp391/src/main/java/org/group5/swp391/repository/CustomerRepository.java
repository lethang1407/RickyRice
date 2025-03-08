package org.group5.swp391.repository;

import org.group5.swp391.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, String> {
    List<Customer> findByPhoneNumberContainingIgnoreCase(String customerPhoneNumber);

    @Query("SELECT c FROM Customer c " +
            "WHERE c.store.id= :id AND " +
            "(:phoneNumber IS NULL OR c.phoneNumber  LIKE %:phoneNumber%)")
    Page<Customer> findAllWithPhoneNumber(Pageable pageable,
                                          @Param("phoneNumber") String phoneNumber,
                                          @Param("id")String storeId);
    @Query("SELECT c FROM Customer c " +
            "WHERE c.store.id= :id AND " +
            "(:phoneNumber IS NULL OR c.phoneNumber  LIKE %:phoneNumber%)")
    List<Customer> findAllWithPhoneNumberInList( @Param("phoneNumber") String phoneNumber,
                                                 @Param("id")String storeId);
    Customer findByPhoneNumber(String phoneNumber);
}