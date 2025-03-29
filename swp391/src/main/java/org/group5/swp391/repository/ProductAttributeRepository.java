package org.group5.swp391.repository;

import org.group5.swp391.entity.ProductAttribute;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductAttributeRepository extends JpaRepository<ProductAttribute, String> {
    @Query("SELECT DISTINCT attr FROM ProductAttribute attr " +
            "JOIN attr.products p " +
            "JOIN p.store s " +
            "JOIN s.storeAccount a " +
            "WHERE a.username = :username" +
            " AND s.id = :storeId")
    List<ProductAttribute> findProductAttributeForUser(@Param("username") String username, @Param("storeId") String storeId);
    Long countAllByStore_Id(String storeId);

    List<ProductAttribute> findAllByStore_Id(String storeId);

    List<ProductAttribute> findAllByStore_Id(String storeId, Pageable pageable);
    @Query("select s from ProductAttribute s")
    List<ProductAttribute> findAll();
}
