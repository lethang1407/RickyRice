package org.group5.swp391.Service.Impl;


import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.EmployeeDTO.StoreDTO;
import org.group5.swp391.DTO.EmployeeDTO.zoneDTO;
import org.group5.swp391.Entity.Zone;
import org.group5.swp391.Repository.ZoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ZoneService {

    @Autowired
    private final ZoneRepository zoneRepository;


    public zoneDTO convertToZoneDTO(Zone zone) {
        zoneDTO ZoneDTO = new zoneDTO();

        ZoneDTO.setZoneID(zone.getZoneID());
        ZoneDTO.setName(zone.getName());
        ZoneDTO.setQuantity(zone.getQuantity());
        ZoneDTO.setSize(zone.getSize());
        ZoneDTO.setCreated_by(zone.getCreatedBy());
        ZoneDTO.setCreated_at(zone.getCreatedAt());
        ZoneDTO.setLocation(zone.getLocation());
        ZoneDTO.setUpdated_at(zone.getUpdatedAt());

        if (zone.getStore() != null) {
            StoreDTO storeDTO = new StoreDTO();
            storeDTO.setStoreID(zone.getStore().getStoreID());
            storeDTO.setStoreName(zone.getStore().getStoreName());
            storeDTO.setAddress(zone.getStore().getAddress());
            storeDTO.setHotline(zone.getStore().getHotline());
            storeDTO.setDescription(zone.getStore().getDescription());
            storeDTO.setImage(zone.getStore().getImage());
            storeDTO.setExpireAt(zone.getStore().getExpireAt());
            storeDTO.setOperatingHour(zone.getStore().getOperatingHour());
            ZoneDTO.setStoreDTO(storeDTO);


        }
        return ZoneDTO;


    }

    public Page<zoneDTO> getAllZone(int page, int size, String sortBy, boolean descending) {
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Zone> zonePage = zoneRepository.findAll(pageable);
        return zonePage.map(this::convertToZoneDTO);
    }

    public Page<zoneDTO>getFilterZones(int page,int size, String sortBy, boolean descending,
                                       Integer quantityMin, Integer quantityMax, Integer sizeMin, Integer sizeMax){
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
    Page<Zone> zonePage=zoneRepository.findFilteredZones(quantityMin,quantityMax,sizeMin,sizeMax,pageable);
    return zonePage.map(this::convertToZoneDTO);
    }

    public Page<zoneDTO>getSearchNameAndLocationZone(int page, int size, String sortBy, boolean descending, String search){
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Zone> zonePage=zoneRepository.findByNameAndLocationIgnoreCase(search,pageable);
        return zonePage.map(this::convertToZoneDTO);
    }

}
