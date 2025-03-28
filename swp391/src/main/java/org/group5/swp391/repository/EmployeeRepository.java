package org.group5.swp391.repository;

import org.group5.swp391.entity.Account;
import org.group5.swp391.entity.Employee;
import org.group5.swp391.entity.Product;
import org.group5.swp391.entity.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, String> {

    @Query("SELECT s " +
            "FROM Employee s " +
            "WHERE s.employeeAccount.id= :accountId")

    Employee findStoreIdByAccountEmpId(@Param("accountId") String accountId);

    @Query("SELECT e FROM Employee e " +
            "JOIN e.store s " +
            "JOIN e.employeeAccount ea " +
            "JOIN s.storeAccount a " +
            "WHERE a.username = :username " +
            "AND (:employeeID IS NULL OR e.id = :employeeID) " +
            "AND (:name IS NULL OR LOWER(ea.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:email IS NULL OR LOWER(ea.email) LIKE LOWER(CONCAT('%', :email, '%'))) " +
            "AND (:phoneNumber IS NULL OR ea.phoneNumber LIKE %:phoneNumber%) " +
            "AND ((:store) IS NULL OR s.id IN (:store))" +
            "AND (:gender IS NULL OR ea.gender = :gender)")
    Page<Employee> findStoreEmployees(
            @Param("username") String username,
            @Param("employeeID") String employeeID,
            @Param("name") String name,
            @Param("email") String email,
            @Param("phoneNumber") String phoneNumber,
            @Param("store") List<String> store,
            @Param("gender") Boolean gender,
            Pageable pageable
    );

    @Query("""
    SELECT e
    FROM Employee e
    JOIN e.store s 
    JOIN s.storeAccount a 
    WHERE a.username = :username 
    AND e.id = :employeeId
""")
    Optional<Employee> findEmployeeForUser(@Param("username") String username, @Param("employeeId") String employeeId);

    int countByStoreIdIn(List<String> storeIds);

}
