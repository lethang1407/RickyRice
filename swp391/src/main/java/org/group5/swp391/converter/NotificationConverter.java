package org.group5.swp391.converter;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationConverter {
    private final ModelMapper modelMapper;
}
