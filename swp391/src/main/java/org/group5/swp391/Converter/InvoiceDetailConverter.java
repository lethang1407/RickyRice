package org.group5.swp391.Converter;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InvoiceDetailConverter {
    private final ModelMapper modelMapper;
}
