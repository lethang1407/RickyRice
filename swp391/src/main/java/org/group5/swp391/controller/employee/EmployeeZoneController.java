package org.group5.swp391.controller.employee;


import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.employee.EmployeeZoneDTO;
import org.group5.swp391.service.impl.ZoneServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/employee")
@RequiredArgsConstructor
public class EmployeeZoneController {
    private final ZoneServiceImpl zoneService;

    @GetMapping("/ricezone/searchzone")
    public Page<EmployeeZoneDTO> searchZone(@RequestParam(value = "page") int page, @RequestParam(value = "size") int size,
                                            @RequestParam(value = "search", required = false) String search) {
        return zoneService.getSearchNameAndLocationZone(page, size, "size", false, search);
    }
}
