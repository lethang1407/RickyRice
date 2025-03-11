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
    Page<Employee> findByEmployeeAccountIn(Collection<Account> employeeAccount,Pageable pageable);
    Page<Employee> findByStoreIn(Collection<Store> stores, Pageable pageable);

    @Query("SELECT s " +
            "FROM Employee s " +
            "WHERE s.employeeAccount.id= :accountId")
    Employee findStoreIdByAccountEmpId(@Param("accountId") String accountId);
    @Query("""
    SELECT e 
    FROM Employee e 
    JOIN e.employeeAccount a 
    WHERE e.store IN :stores
      AND (:name IS NULL OR LOWER(a.name) LIKE LOWER(CONCAT('%', :name, '%')))
      AND (:gender IS NULL OR a.gender = :gender)
""")
    Page<Employee> findByStoreInAndNameAndGender(
            @Param("stores") List<Store> stores,
            @Param("name") String name,
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
}
