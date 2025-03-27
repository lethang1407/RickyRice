package org.group5.swp391.service;

import org.group5.swp391.dto.employee.EmployeeZoneDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreZoneIdAndNameDTO;
import org.group5.swp391.dto.store_owner.store_detail.StoreDetailZoneDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public interface ZoneService {
    public Page<EmployeeZoneDTO> getAllZone(int page, int size, String sortBy, boolean descending);
    public Page<EmployeeZoneDTO>getSearchNameAndLocationZone(int page, int size, String sortBy, boolean descending, String search);
    public List<StoreZoneIdAndNameDTO> getZoneIdAndNameForStore(String storeId);
    //Hieu
    public Page<StoreDetailZoneDTO> getStoreZones(String search, String storeID, int page, int size, String sortBy, boolean descending) throws Exception;
    public StoreDetailZoneDTO getZone(String zoneID);
    public void addZone(StoreDetailZoneDTO storeZoneDTO) throws Exception;
    public void updateZone(String zoneID, StoreDetailZoneDTO storeZoneDTO) throws Exception;
    public Page<StoreDetailZoneDTO> getZonesByFilter(String storeID, String name, String location, String productName, LocalDate fromCreatedAt, LocalDate toCreatedAt, LocalDate fromUpdateAt, LocalDate toUpdateAt, int page, int size, String sortBy, boolean descending);
    public List<StoreZoneIdAndNameDTO> getEmptyZoneIdAndNameForStore(String storeId);

}
