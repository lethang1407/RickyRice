package org.group5.swp391.converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.notification.NotificationDTO;
import org.group5.swp391.entity.Notification;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationConverter {
    private final ModelMapper modelMapper;

    public NotificationDTO toDto(Notification notification){
        NotificationDTO dto = new NotificationDTO();
        dto.setRead(notification.getIsRead());
        dto.setMessage(notification.getMessage());
        return dto;
    }
}
