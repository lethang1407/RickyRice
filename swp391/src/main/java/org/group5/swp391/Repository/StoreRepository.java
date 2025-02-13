package org.group5.swp391.Repository;

import org.group5.swp391.Entity.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreRepository extends JpaRepository<Store, String> {
    Page<Store> findAll(Pageable pageable);
    Page<Store> findByStoreNameContainingIgnoreCase(String storeName, Pageable pageable);
}
