package org.group5.swp391.repository;




import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.group5.swp391.entity.Package;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface PackageRepository extends JpaRepository<Package, Long> {
    @Query("Select z from Package z where "+
            "(z.store.id = :storeId)")
    List<Package> findPackagesByStoreId(String storeId);
    @Query("Select z from Package z where "+
            "(z.id= :id)")
    Package findPackageByStringId(String id);

}
