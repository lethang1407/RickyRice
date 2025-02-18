package org.group5.swp391.Converter;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class SubcriptionPlanConverter {
    private final ModelMapper modelMapper;
}
