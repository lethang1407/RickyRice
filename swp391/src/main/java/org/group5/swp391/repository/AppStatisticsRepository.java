package org.group5.swp391.repository;

import org.group5.swp391.entity.AppStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppStatisticsRepository extends JpaRepository<AppStatistics, String> {

    // Lấy danh sách thống kê theo storeId
    List<AppStatistics> findByStore_Id(String storeID);

    // Lấy danh sách thống kê theo gói đăng ký
    List<AppStatistics> findBySubcriptionPlanName(String planName);
}
