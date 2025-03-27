package org.group5.swp391.repository;

import org.group5.swp391.entity.SubscriptionPlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, String> {
    // Lấy danh sách gói dịch vụ theo trạng thái hiển thị
    List<SubscriptionPlan> findSubscriptionPlanByIsActive(Boolean isActive);

    // Tìm gói dịch vụ có trạng thái hiển thị True theo ID
    Optional<SubscriptionPlan> findByIdAndIsActiveTrue(String id);

    // Tìm gói dịch vụ theo giá
    SubscriptionPlan findByPrice(Double price);

    // Lấy danh sách các gói dịch vụ (phân trang, tìm kiếm, sắp xếp)
    Page<SubscriptionPlan> findByNameContainingIgnoreCase(String name, Pageable pageable);

}
