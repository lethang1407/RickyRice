package org.group5.swp391.Repository;

import org.group5.swp391.Entity.Zone;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, Long> {
    @Query("SELECT SUM(z.quantity) FROM Zone z WHERE z.product.category.categoryID = :categoryId")
    Long findTotalQuantityByCategoryId(String categoryId);

    Page<Zone> findAll(Pageable pageable);

    @Query("SELECT z FROM Zone z WHERE " +
            "(:quantityMin IS NULL OR z.quantity >= :quantityMin) AND " +
            "(:quantityMax IS NULL OR z.quantity <= :quantityMax) AND " +
            "(:sizeMin IS NULL OR z.size >= :sizeMin) AND " +
            "(:sizeMax IS NULL OR z.size <= :sizeMax)")
    Page<Zone> findFilteredZones(@Param("quantityMin") Integer quantityMin,
                                 @Param("quantityMax") Integer quantityMax,
                                 @Param("sizeMin") Integer sizeMin,
                                 @Param("sizeMax") Integer sizeMax,
                                 @Param("search") String search,
                                 Pageable pageable
    );

    @Query("SELECT s FROM Zone s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) or LOWER(s.location) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Zone> findByNameAndLocationIgnoreCase(String search, Pageable pageable);

}
