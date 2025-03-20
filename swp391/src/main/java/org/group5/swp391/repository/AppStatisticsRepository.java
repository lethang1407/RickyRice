package org.group5.swp391.repository;

import org.group5.swp391.entity.AppStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppStatisticsRepository extends JpaRepository<AppStatistics, String> {

    // Lấy danh sách thống kê theo storeId
    List<AppStatistics> findByStore_Id(String storeID);

    // Lấy danh sách thống kê theo gói đăng ký
    List<AppStatistics> findBySubcriptionPlanName(String planName);

    // Kiểm tra tồn tại mã giao dịch
    boolean existsByTransactionNo(String transactionNo);

    // Lấy danh sách các TransactionNo có StoreID là null
    @Query("SELECT a.transactionNo FROM AppStatistics a WHERE a.store IS NULL")
    List<String> findTransactionNosWithNullStore();

    // Lấy thông kê giao dịch theo TransactionNo
    Optional<AppStatistics> getAppStatisticsByTransactionNo(String transactionNo);

    // Lấy giao dịch theo TransactionNo
    Optional<AppStatistics> findByTransactionNo(String transactionNo);

    // Lấy mã giao dịch và gói dịch vụ của Owner theo username
    @Query("SELECT a.transactionNo, a.subcriptionTimeOfExpiration FROM AppStatistics a WHERE a.store IS NULL AND a.createdBy = :username")
    List<Object[]> findTransactionAndExpirationWithNullStoreAndCreatedBy(String username);


}
