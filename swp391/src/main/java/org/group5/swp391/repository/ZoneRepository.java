package org.group5.swp391.repository;

import org.group5.swp391.entity.Zone;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, String> {
    Page<Zone> findAll(Pageable pageable);

    @Query("SELECT z FROM Zone z WHERE " +
//            "(:quantityMin IS NULL OR z.quantity >= :quantityMin) AND " +
//            "(:quantityMax IS NULL OR z.quantity <= :quantityMax) AND " +
//            "(:sizeMin IS NULL OR z.size >= :sizeMin) AND " +
//            "(:sizeMax IS NULL OR z.size <= :sizeMax) AND " +
            "(z.store.id = :storeId) AND " +
            "(:search IS NULL OR LOWER(z.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Zone> findFilteredZones(
                                  @Param("search") String search,
                                  String storeId,
                                  Pageable pageable
    );

    @Query("SELECT s FROM Zone s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) or LOWER(s.location) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Zone> findByNameAndLocationIgnoreCase(String search, Pageable pageable);

    List<Zone> findByStoreId(String storeId);
}
