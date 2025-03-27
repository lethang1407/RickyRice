package org.group5.swp391.repository;

import org.group5.swp391.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, String> {
    List<Account> findByNameContainingIgnoreCaseAndGender(String name, Boolean gender);

    public Optional<Account> findByUsername(String username);

    public Optional<Account> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END " +
            "FROM Account a " +
            "JOIN Employee e ON a.id = e.employeeAccount.id " +
            "WHERE a.email = :email AND e.store.id = :storeId")
    boolean existsByEmailAndStore(String email, String storeId);

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END " +
            "FROM Account a " +
            "JOIN Employee e ON a.id = e.employeeAccount.id " +
            "WHERE a.phoneNumber = :phoneNumber AND e.store.id = :storeId")
    boolean existsByPhoneNumberAndStore(String phoneNumber, String storeId);

    @Transactional
    @Modifying
    @Query("UPDATE Account a SET a.otp = NULL WHERE a.id = :accountID")
    void clearOTP(String accountID);
//    public Account findByUsername(String username);

    // Tìm tài khoản theo role
    public List<Account> findByRole_Code(String roleCode);

    // Tìm tài khoản theo Account ID
    Optional<Account> findById(String accountID);

    // Lấy danh sách tài khoản store_owner (phân trang, tìm kiếm, lọc)
    @Query("""
                SELECT a FROM Account a 
                WHERE a.role.code = 'STORE_OWNER' 
                AND (:isActive IS NULL OR a.isActive = :isActive)
                AND (:gender IS NULL OR a.gender = :gender)
                AND (
                    :search IS NULL OR 
                    LOWER(a.name) LIKE LOWER(CONCAT('%', :search, '%')) OR 
                    LOWER(a.email) LIKE LOWER(CONCAT('%', :search, '%')) OR 
                    LOWER(a.phoneNumber) LIKE LOWER(CONCAT('%', :search, '%'))
                )
            """)
    Page<Account> searchStoreOwners(
            @Param("isActive") Boolean isActive,
            @Param("gender") Boolean gender,
            @Param("search") String search,
            Pageable pageable
    );

    // Lấy số lượng tài khoản store_owner
    @Query("SELECT COUNT(a) FROM Account a WHERE a.role.code = 'STORE_OWNER'")
    Long countStoreOwners();

}
