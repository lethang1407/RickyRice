package org.group5.swp391.converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.employee.EmployeePackageDTO;
import org.group5.swp391.dto.packagee.PackageCreationRequest;
import org.group5.swp391.dto.packagee.PackageDTO;
import org.group5.swp391.entity.Package;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
public class PackageConverter {
    private final ModelMapper modelMapper;
    public EmployeePackageDTO toEmployeePackageDTO(Package pack) {
        return modelMapper.map(pack, EmployeePackageDTO.class);
    }

    public PackageDTO toPackageDTO(Package pack){
        return modelMapper.map(pack, PackageDTO.class);
    }

    public Package toPackageEntity(PackageCreationRequest request){
        request.setName(request.getName().trim());
        if(StringUtils.hasLength(request.getDescription())){
            request.setDescription(request.getDescription().trim());
        }
        Package pack  = modelMapper.map(request, Package.class);
        pack.setId(null);
        return pack;
    }
}
