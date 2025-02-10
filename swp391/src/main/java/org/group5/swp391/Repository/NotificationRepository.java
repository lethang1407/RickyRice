package org.group5.swp391.Repository;

import org.group5.swp391.Entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {

    // Lấy danh sách thông báo theo tài khoản nhận được
    List<Notification> findByTargetAccount_AccountID(String targetAccountID);


}
