package org.group5.swp391.repository;

import org.group5.swp391.dto.employee.EmployeeCustomerDTO;
import org.group5.swp391.dto.employee.EmployeeCustomerDTO;
import org.group5.swp391.entity.Customer;
import org.group5.swp391.entity.Debt;
import org.group5.swp391.enums.DebtType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
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
    List<Customer> findByEmail(String email);

    @Query("""
    SELECT new org.group5.swp391.dto.employee.EmployeeCustomerDTO(c.id, c.name, c.phoneNumber) FROM Customer c
    WHERE ( c.store.id IN (:storeList))
    """)
    public List<EmployeeCustomerDTO> getCustomersForDebts(List<String> storeList);

    @Query("""
    SELECT c FROM Customer c
    WHERE ( c.store.id IN (:storeId))
      AND (:startCreatedAt IS NULL OR c.createdAt >= :startCreatedAt)
      AND (:endCreatedAt IS NULL OR c.createdAt <= :endCreatedAt)
      AND (:startUpdatedAt IS NULL OR c.updatedAt >= :startUpdatedAt)
      AND (:endUpdatedAt IS NULL OR c.updatedAt <= :endUpdatedAt)
      AND (:customerName IS NULL OR TRIM(:customerName) <> '' AND LOWER(c.name) LIKE LOWER(CONCAT('%', :customerName, '%')))
      AND (:phoneNumber IS NULL OR TRIM(:phoneNumber) <> '' AND c.phoneNumber LIKE CONCAT('%', :phoneNumber, '%'))
      AND (:email IS NULL OR TRIM(:email) <> '' AND LOWER(c.email) LIKE LOWER(CONCAT('%', :email, '%')))
      AND (:address IS NULL OR TRIM(:address) <> '' AND LOWER(c.address) LIKE LOWER(CONCAT('%', :address, '%')))
      AND (:fromAmount IS NULL OR c.balance >= :fromAmount)
      AND (:toAmount IS NULL OR c.balance <= :toAmount)
      AND (:createdBy IS NULL OR TRIM(:createdBy) <> '' AND LOWER(c.createdBy) LIKE LOWER(CONCAT('%', :createdBy, '%')))
""")
    Page<Customer> searchForDebtCustomer(
            @Param("storeId") List<String> storeId,
            @Param("startCreatedAt") LocalDateTime startCreatedAt,
            @Param("endCreatedAt") LocalDateTime endCreatedAt,
            @Param("startUpdatedAt") LocalDateTime startUpdatedAt,
            @Param("endUpdatedAt") LocalDateTime endUpdatedAt,
            @Param("customerName") String customerName,
            @Param("phoneNumber") String phoneNumber,
            @Param("email") String email,
            @Param("address") String address,
            @Param("fromAmount") Double fromAmount,
            @Param("toAmount") Double toAmount,
            @Param("createdBy") String createdBy,
            Pageable pageable
    );

    public boolean existsByPhoneNumber(String phoneNumber);
    public boolean existsByEmail(String email);
}