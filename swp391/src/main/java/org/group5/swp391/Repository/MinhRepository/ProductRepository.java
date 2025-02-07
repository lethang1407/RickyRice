package org.group5.swp391.Repository.MinhRepository;


import org.group5.swp391.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
  @Query("Select s from Product  s where s.category.categoryID = ?1")
  List<Product> findAllByCategoryId(String categoryId);


}
