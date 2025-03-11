package org.group5.swp391.service.impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.NotificationConverter;
import org.group5.swp391.dto.notification.NotificationDTO;
import org.group5.swp391.dto.notification.SendNotificationRequest;
import org.group5.swp391.dto.request.admin_request.MarkAsReadRequest;
import org.group5.swp391.dto.response.account_response.NotificationResponse;
import org.group5.swp391.entity.Notification;
import org.group5.swp391.exception.AppException;
import org.group5.swp391.exception.ErrorCode;
import org.group5.swp391.repository.AccountRepository;
import org.group5.swp391.repository.NotificationRepository;
import org.group5.swp391.service.NotificationService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final AccountRepository accountRepository;
    private final NotificationConverter notificationConverter;
    private final SimpMessagingTemplate messagingTemplate;

    // lấy danh sách thông báo theo ID người nhận
    public List<NotificationResponse> getNotificationsByTargetAccountId(String targetAccountID) {
        return notificationRepository.findByTargetAccount_Id(targetAccountID).stream()
                .map(notification -> NotificationResponse.builder()
                        .notificationId(notification.getId())
                        .message(notification.getMessage())
                        .isRead(notification.getIsRead())
                        .createdAt(notification.getCreatedAt())
                        .createdBy(notification.getCreatedBy())
                        .accountId(notification.getSendAccount().getId())
                        .targetAccountId(notification.getTargetAccount().getId())
                        .build())
                .collect(Collectors.toList());
    }

    // cập nhật trạng thái đã xem thông báo
    public void markMultipleAsRead(MarkAsReadRequest request) {
        List<Notification> notifications = notificationRepository.findAllById(request.getNotificationIDs());

        if (notifications.isEmpty()) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }

        notifications.forEach(notification -> notification.setIsRead(request.getIsRead()));
        notificationRepository.saveAll(notifications);
    }

    @Override
    public void sendNotification(SendNotificationRequest request) {
        NotificationDTO notification = saveNotification(request);
        messagingTemplate.convertAndSendToUser(request.getTargetUsername(), "/private", notification);
    }

    @Override
    public NotificationDTO saveNotification(SendNotificationRequest request) {
        Notification notification = new Notification();

        String sendUsername = request.getTargetUsername();

        Account sendUser = accountRepository
                .findByUsername(sendUsername)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Account targetUser = accountRepository
                .findByUsername(request.getTargetUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        notification.setSendAccount(sendUser);
        notification.setTargetAccount(targetUser);
        notification.setMessage(request.getMessage());
        notification.setIsRead(false);

        return notificationConverter.toDto(notificationRepository.save(notification));
    }
}
