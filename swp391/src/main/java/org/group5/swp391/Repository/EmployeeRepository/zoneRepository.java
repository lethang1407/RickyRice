package org.group5.swp391.Repository.EmployeeRepository;

import org.group5.swp391.Entity.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface zoneRepository extends JpaRepository<Zone, Long> {
    @Query("SELECT SUM(z.quantity) FROM Zone z WHERE z.product.category.categoryID = :categoryId")
    Long findTotalQuantityByCategoryId(String categoryId);

}
