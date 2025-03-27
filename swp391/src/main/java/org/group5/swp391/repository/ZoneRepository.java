package org.group5.swp391.repository;

import org.group5.swp391.entity.Zone;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, String> {
    Page<Zone> findAll(Pageable pageable);

    @Query(value = "SELECT * FROM zone WHERE storeid = :storeId " +
            "AND (:search IS NULL OR LOWER(name) LIKE LOWER(N'%' + :search + '%')) "+
            "OR ( LOWER(location) LIKE LOWER(N'%' + :search + '%'))",
            nativeQuery = true)
    Page<Zone> findFilteredZones(
            @Param("search") String search,
            @Param("storeId") String storeId,
            Pageable pageable
    );

    @Query("SELECT s FROM Zone s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) or LOWER(s.location) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Zone> findByNameAndLocationIgnoreCase(String search, Pageable pageable);

    List<Zone> findByStoreId(String storeId);

    @Query("SELECT z FROM Zone z WHERE z.store.id = :storeID")
    Page<Zone> findZonesByStore_StoreID(String storeID, Pageable pageable);

    @Query("SELECT z FROM Zone z WHERE z.store.id = :storeID AND ( z.name LIKE %:search% OR z.product.information LIKE %:search%)")
    Page<Zone> findZoneByNameAndInformationContainsIgnoreCase(String storeID, String search, Pageable pageable);

    Zone findZoneById(String id);

    Zone getZoneById(String id);

    List<Zone> findByStoreIdAndProductIsNull(String storeId);

    @Query("""
    SELECT z FROM Zone z
    WHERE (:storeID IS NULL OR z.store.id = :storeID)
      AND (:name IS NULL OR TRIM(:name) <> '' AND  LOWER(z.name) LIKE LOWER(CONCAT('%', :name, '%')))
      AND (:location IS NULL OR TRIM(:location) <> '' AND LOWER(z.location) LIKE LOWER(CONCAT('%', :location, '%')))
      AND (:productName IS NULL OR TRIM(:productName) <> '' AND  LOWER(z.product.name) LIKE LOWER(CONCAT('%', :productName, '%')))
      AND (:fromCreatedAt IS NULL OR z.createdAt >= :fromCreatedAt)
      AND (:toCreatedAt IS NULL OR z.createdAt <= :toCreatedAt)
      AND (:fromUpdatedAt IS NULL OR z.updatedAt >= :fromUpdatedAt)
      AND (:toUpdatedAt IS NULL OR z.updatedAt <= :toUpdatedAt)
    """)
    Page<Zone> findZonesByFilters(@Param("storeID") String storeID,
                                  @Param("name") String name,
                                  @Param("location") String location,
                                  @Param("productName") String productName,
                                  @Param("fromCreatedAt") LocalDateTime fromCreatedAt,
                                  @Param("toCreatedAt") LocalDateTime toCreatedAt,
                                  @Param("fromUpdatedAt") LocalDateTime fromUpdateAt,
                                  @Param("toUpdatedAt") LocalDateTime toUpdatedAt,
                                  Pageable pageable);

}
