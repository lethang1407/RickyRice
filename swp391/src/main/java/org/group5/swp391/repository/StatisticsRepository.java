package org.group5.swp391.repository;

import org.group5.swp391.entity.Statistics;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StatisticsRepository extends JpaRepository<Statistics, String> {

    @Query("""
        SELECT s
        FROM Statistics s
        WHERE (:storeName IS NULL OR LOWER(s.store.storeName) LIKE LOWER(CONCAT('%', :storeName, '%')))
        AND (:isStoreFilterDisabled = true OR s.store.id IN :stores)
    """)
    Page<Statistics> findStatisticsByStores(
            @Param("stores") List<String> stores,
            @Param("storeName") String storeName,
            @Param("isStoreFilterDisabled") boolean isStoreFilterDisabled,
            Pageable pageable
    );
}