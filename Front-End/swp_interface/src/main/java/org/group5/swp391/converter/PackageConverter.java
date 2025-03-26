package org.group5.swp391.converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.employee.EmployeePackageDTO;
import org.group5.swp391.entity.Package;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PackageConverter {
    private final ModelMapper modelMapper;
    public EmployeePackageDTO toEmployeePackageDTO(Package pack) {
        return modelMapper.map(pack, EmployeePackageDTO.class);
    }

}
