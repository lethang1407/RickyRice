package org.group5.swp391.Converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.CustomerRequirementDTO.CustomerZoneDTO;
import org.group5.swp391.DTO.EmployeeDTO.EmployeeStoreDTO;
import org.group5.swp391.DTO.EmployeeDTO.EmployeeZoneDTO;
import org.group5.swp391.Entity.Zone;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ZoneConverter {

    private final ModelMapper modelMapper;
    public CustomerZoneDTO toZoneDTO(Zone zone) {
        return modelMapper.map(zone, CustomerZoneDTO.class);
    }

    public EmployeeZoneDTO toEmployeeZoneDTO(Zone zone) {
        EmployeeZoneDTO EmployeeZoneDTO = new EmployeeZoneDTO();

        EmployeeZoneDTO.setZoneID(zone.getZoneID());
        EmployeeZoneDTO.setName(zone.getName());
        EmployeeZoneDTO.setQuantity(zone.getQuantity());
        EmployeeZoneDTO.setSize(zone.getSize());
        EmployeeZoneDTO.setCreated_by(zone.getCreatedBy());
        EmployeeZoneDTO.setCreated_at(zone.getCreatedAt());
        EmployeeZoneDTO.setLocation(zone.getLocation());
        EmployeeZoneDTO.setUpdated_at(zone.getUpdatedAt());

        if (zone.getStore() != null) {
            EmployeeStoreDTO employeeStoreDTO = new EmployeeStoreDTO();
            employeeStoreDTO.setStoreID(zone.getStore().getStoreID());
            employeeStoreDTO.setStoreName(zone.getStore().getStoreName());
            employeeStoreDTO.setAddress(zone.getStore().getAddress());
            employeeStoreDTO.setHotline(zone.getStore().getHotline());
            employeeStoreDTO.setDescription(zone.getStore().getDescription());
            employeeStoreDTO.setImage(zone.getStore().getImage());
            employeeStoreDTO.setExpireAt(zone.getStore().getExpireAt());
            employeeStoreDTO.setOperatingHour(zone.getStore().getOperatingHour());
            EmployeeZoneDTO.setEmployeeStoreDTO(employeeStoreDTO);

        }
        return EmployeeZoneDTO;
    }
}
