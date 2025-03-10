package org.group5.swp391.service.impl;


import lombok.RequiredArgsConstructor;
import org.group5.swp391.converter.ZoneConverter;
import org.group5.swp391.dto.employee.EmployeeZoneDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreZoneIdAndNameDTO;
import org.group5.swp391.entity.Zone;
import org.group5.swp391.repository.ZoneRepository;
import org.group5.swp391.service.ZoneService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ZoneServiceImpl implements ZoneService {
    private final ZoneRepository zoneRepository;
    private final ZoneConverter zoneConverter;

    public Page<EmployeeZoneDTO> getAllZone(int page, int size, String sortBy, boolean descending) {
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Zone> zonePage = zoneRepository.findAll(pageable);
        return zonePage.map(zoneConverter::toEmployeeZoneDTO);
    }


    public Page<EmployeeZoneDTO>getSearchNameAndLocationZone(int page, int size, String sortBy, boolean descending, String search){
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Zone> zonePage=zoneRepository.findByNameAndLocationIgnoreCase(search,pageable);
        return zonePage.map(zoneConverter::toEmployeeZoneDTO);
    }

    @Override
    public List<StoreZoneIdAndNameDTO> getZoneIdAndNameForStore(String storeId) {
        return zoneRepository.findByStoreId(storeId).stream().map(zoneConverter::toStoreZoneIdAndNameDTO).collect(Collectors.toList());
    }
}
