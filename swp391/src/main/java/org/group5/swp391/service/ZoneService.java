package org.group5.swp391.service;

import org.group5.swp391.dto.employee.EmployeeZoneDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface ZoneService {
    public Page<EmployeeZoneDTO> getAllZone(int page, int size, String sortBy, boolean descending);
    public Page<EmployeeZoneDTO>getSearchNameAndLocationZone(int page, int size, String sortBy, boolean descending, String search);
}
