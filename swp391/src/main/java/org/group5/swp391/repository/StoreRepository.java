package org.group5.swp391.repository;

import org.group5.swp391.entity.Account;
import org.group5.swp391.entity.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<Store, String> {
    Page<Store> findByStoreAccount(Account storeAccount, Pageable pageable);

    Page<Store> findByStoreAccountAndStoreNameContainingIgnoreCase(Account account, String storeName, Pageable pageable);

    List<Store> findByStoreAccount(Account storeAccount);

    Optional<Store> findByIdAndStoreAccount_Username(String storeID, String username);

    @Query("""
                SELECT s.id
                FROM Store s
                WHERE s.storeAccount.username = :userName
            """)
    List<String> findIdsByUserName(@Param("userName") String userName);

    @Query("""
                SELECT s
                FROM Store s
                WHERE s.storeAccount.username = :userName
            """)
    List<Store> findByUserName(@Param("userName") String userName);

    // Lấy danh sách tất cả cửa hàng của hệ thống (phân trang, tìm kiếm sắp xếp)
    @Query("""
                SELECT s FROM Store s
                LEFT JOIN FETCH s.storeAccount
                LEFT JOIN FETCH s.subscriptionPlan
                WHERE (:keyword IS NULL OR 
                       LOWER(s.storeName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                       LOWER(s.storeAccount.username) LIKE LOWER(CONCAT('%', :keyword, '%')))
                AND (:subscriptionPlanName IS NULL OR :subscriptionPlanName = '' OR s.subscriptionPlan.name = :subscriptionPlanName)
            """)
    Page<Store> searchStores(
            @Param("keyword") String keyword,
            @Param("subscriptionPlanName") String subscriptionPlanName,
            Pageable pageable
    );

    // Danh sách các gói đăng kí của cửa hàng
    @Query("SELECT DISTINCT s.subscriptionPlan.name FROM Store s WHERE s.subscriptionPlan IS NOT NULL")
    List<String> findAllSubscriptionPlanNames();

    // Tổng số cửa hàng
    @Query("SELECT COUNT(s) FROM Store s")
    long countTotalStores();
}