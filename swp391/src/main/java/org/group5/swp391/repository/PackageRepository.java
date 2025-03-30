package org.group5.swp391.repository;




import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.group5.swp391.entity.Package;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface PackageRepository extends JpaRepository<Package, Long> {
    @Query("SELECT z FROM Package z WHERE z.store.id = :storeId ORDER BY z.quantity ASC")
    List<Package> findPackagesByStoreId(String storeId);
    @Query("Select z from Package z where "+
            "(z.id= :id)")
    Package findPackageByStringId(String id);


    @Query("""
    SELECT p FROM Package p
    WHERE (( p.store.id IN (:storeId)))
      AND (:quantity IS NULL OR p.quantity = :quantity)
      AND (:name IS NULL OR TRIM(:name) <> '' AND LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')))
""")
    Page<Package> findPackages(
            @Param("storeId") List<String> storeId,
            @Param("quantity") Long quantity,
            @Param("name") String name,
            Pageable pageable
    );
    public boolean existsByName(String name);
}
