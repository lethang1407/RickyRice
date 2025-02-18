package org.group5.swp391.Service.Impl;


import lombok.RequiredArgsConstructor;
import org.group5.swp391.Converter.ZoneConverter;
import org.group5.swp391.DTO.EmployeeDTO.EmployeeZoneDTO;
import org.group5.swp391.Entity.Zone;
import org.group5.swp391.Repository.ZoneRepository;
import org.group5.swp391.Service.ZoneService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

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

    public Page<EmployeeZoneDTO>getFilterZones(int page, int size, String sortBy, boolean descending,
                                               Integer quantityMin, Integer quantityMax, Integer sizeMin, Integer sizeMax, String search){
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        if (search.equals("")) {
            search = null;
        }
        Page<Zone> zonePage = zoneRepository.findFilteredZones(quantityMin, quantityMax, sizeMin, sizeMax, search, pageable);
    return zonePage.map(zoneConverter::toEmployeeZoneDTO);
    }

    public Page<EmployeeZoneDTO>getSearchNameAndLocationZone(int page, int size, String sortBy, boolean descending, String search){
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Zone> zonePage=zoneRepository.findByNameAndLocationIgnoreCase(search,pageable);
        return zonePage.map(zoneConverter::toEmployeeZoneDTO);
    }

}
