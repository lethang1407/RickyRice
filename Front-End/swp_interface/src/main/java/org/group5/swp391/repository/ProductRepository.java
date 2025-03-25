package org.group5.swp391.repository;

import org.group5.swp391.entity.Product;
import org.group5.swp391.entity.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository("storeOwnerProductRepository")
public interface ProductRepository extends JpaRepository<Product, String> {
    Page<Product> findAll(Pageable pageable);

    @Query("SELECT p FROM Product p " +
            "JOIN p.store s " +
            "JOIN s.storeAccount sa " +
            "JOIN p.category c " +
            "WHERE (:productID IS NULL OR p.id = :productID) " +
            "AND (:productName IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :productName, '%'))) " +
            "AND (:priceMin IS NULL OR p.price >= :priceMin) " +
            "AND (:priceMax IS NULL OR p.price <= :priceMax) " +
            "AND (:categoryName IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :categoryName, '%'))) " +
            "AND (:quantityMin IS NULL OR p.quantity >= :quantityMin) " +
            "AND (:quantityMax IS NULL OR p.quantity <= :quantityMax) " +
            "AND ((:storeIds) IS NULL OR s.id IN (:storeIds))" +
            "AND sa.username = :username")
    Page<Product> findProducts(String productID,
                               String productName,
                               Double priceMin,
                               Double priceMax,
                               String categoryName,
                               List<String> storeIds,
                               Integer quantityMin,
                               Integer quantityMax,
                               String username,
                               Pageable pageable);

    int countByStoreIdIn(List<String> storeIds);

    //minh
    @Query("SELECT p FROM Product p WHERE "
            + "(:name IS NULL OR LOWER(p.name) LIKE %:name%) AND "
            + "(p.store.id = :storeId) AND "
            + "(:minQuantity IS NULL OR p.quantity >= :minQuantity) AND "
            + "(:maxQuantity IS NULL OR p.quantity <= :maxQuantity)")
    Page<Product> findByNameAndStoreIdContainingIgnoreCase(@Param("name") String name,
                                                           @Param("storeId") String storeId,
                                                           Pageable pageable,
                                                           @Param("minQuantity") Integer minQuantity,
                                                           @Param("maxQuantity") Integer maxQuantity);

    @Query("SELECT s FROM Product s WHERE s.store.id = :id " +
            "AND (:name IS NULL OR :name = '' " +
            "OR LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%')))")
    List<Product> findByNameAndStoreIdContainingIgnoreCaseInList(@Param("name") String name,
                                                                 @Param("id") String storeid);

    @Query("Select s from Product  s where s.category.id = ?1")
    List<Product> findAllByCategoryId(String categoryId);

    @Query("Select s from Product s where s.category.id = :categoryId")
    Page<Product> findAllByCategoryId(Pageable pageable, String categoryId);

    @Query("SELECT s FROM Product s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%')) and s.category.id = :categoryId")
    Page<Product> findByNameIgnoreCase(String name, String categoryId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
            "p.name LIKE CONCAT('%',:query, '%') ")
//            "OR p.information LIKE CONCAT('%',:query, '%')")
    Page<Product> searchProducts(String query, Pageable pageable);

    List<Product> findByNameContainingAndPriceBetween(String name, Double minPrice, Double maxPrice, Pageable pageable);

    @Query("select  p from Product p where p.id = :stringId")
    Product findByStringId(String stringId);

    Optional<Product> findById(String id);

    @Query("""
                SELECT p 
                FROM Product p 
                JOIN p.store s 
                JOIN s.storeAccount a 
                WHERE a.username = :username 
                AND p.id = :productId
            """)
    Optional<Product> findProductForUser(@Param("username") String username, @Param("productId") String productId);

    @Query("SELECT p FROM Product p WHERE p.store.id = :storeID")
    List<Product> findProductsByStoreID(String storeID, Pageable pageable);
    @Query("SELECT p FROM Product p WHERE p.store.id = :storeID AND (p.name LIKE %:search% OR p.information LIKE %:search%)")
    List<Product> findProductsByInformationAndNameContainingIgnoreCase(String search, String storeID, Pageable pageable);
}