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

    @Query("SELECT s FROM Zone s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) or LOWER(s.location) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Zone> findByNameAndLocationIgnoreCase(String search, Pageable pageable);

    List<Zone> findByStoreId(String storeId);
}
