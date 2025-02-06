package org.group5.swp391.Converter.ProductConverterTool;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.ProductDTOTool.ZoneDTO;
import org.group5.swp391.Entity.Zone;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ZoneConverter {

    private final ModelMapper modelMapper;
    public ZoneDTO toZoneDTO(Zone zone) {
        return modelMapper.map(zone, ZoneDTO.class);
    }
}
