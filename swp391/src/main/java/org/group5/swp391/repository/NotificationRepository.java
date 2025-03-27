package org.group5.swp391.repository;

import org.group5.swp391.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {

    // Lấy danh sách thông báo theo tài khoản nhận được
    List<Notification> findByTargetAccount_Id(String targetAccountID);

    List<Notification> findByTargetAccount_IdOrSendAccount_Id(String targetAccountId, String sendAccountId);

}
