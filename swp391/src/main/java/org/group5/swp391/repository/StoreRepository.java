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
}