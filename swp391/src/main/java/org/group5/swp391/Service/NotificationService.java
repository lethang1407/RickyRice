package org.group5.swp391.Service;

import org.group5.swp391.DTO.Request.AdminRequest.MarkAsReadRequest;
import org.group5.swp391.DTO.Response.AdminResponse.NotificationResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface NotificationService {
    public List<NotificationResponse> getNotificationsByTargetAccountId(String targetAccountID);
    public void markMultipleAsRead(MarkAsReadRequest request);
}
