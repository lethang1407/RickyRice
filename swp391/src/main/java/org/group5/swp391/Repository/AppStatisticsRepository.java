package org.group5.swp391.Repository;

import org.group5.swp391.Entity.AppStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppStatisticsRepository extends JpaRepository<AppStatistics, String> {

    // Lấy danh sách thống kê theo storeId
    List<AppStatistics> findByStore_StoreID(String storeID);

    // Lấy danh sách thống kê theo gói đăng ký
    List<AppStatistics> findBySubcriptionPlanName(String planName);
}
