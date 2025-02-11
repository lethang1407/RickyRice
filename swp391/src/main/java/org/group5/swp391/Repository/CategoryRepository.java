package org.group5.swp391.Repository;

import org.group5.swp391.Entity.Category;
import org.group5.swp391.Entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {


    Page<Category> findAll(Pageable pageable);
    @Query("SELECT s FROM Category s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Category> findByNameIgnoreCase(String name, Pageable pageable);
}
