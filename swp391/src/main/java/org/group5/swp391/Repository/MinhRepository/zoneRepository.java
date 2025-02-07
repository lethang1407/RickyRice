package org.group5.swp391.Repository.MinhRepository;

import org.group5.swp391.Entity.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface zoneRepository extends JpaRepository<Zone, Long> {
    @Query("SELECT SUM(z.quantity) FROM Zone z WHERE z.product.category.categoryID = :categoryId")
    Long findTotalQuantityByCategoryId(String categoryId);

}
