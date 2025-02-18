package org.group5.swp391.Controller.EmployeeController;


import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.EmployeeDTO.EmployeeZoneDTO;
import org.group5.swp391.Service.Impl.ZoneServiceImpl;
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

    @GetMapping("/ricezone")
    public Page<EmployeeZoneDTO> getFilterZones(@RequestParam("page") int page, @RequestParam("size") int size,
                                                @RequestParam(value = "quantityMin", required = false) Integer quantityMin,
                                                @RequestParam(value = "quantityMax", required = false) Integer quantityMax,
                                                @RequestParam(value = "sizeMin", required = false) Integer sizeMin,
                                                @RequestParam(value = "sizeMax", required = false) Integer sizeMax,
                                                @RequestParam(value = "sortBy", required = false, defaultValue = "size") String sortBy,
                                                @RequestParam(value = "sortOrder", required = false, defaultValue = "false") boolean sortOrder,
                                                @RequestParam(value = "search", required = false, defaultValue = "") String search )
    {
        return zoneService.getFilterZones(page, size, sortBy, sortOrder, quantityMin, quantityMax, sizeMin, sizeMax, search);
    }

    @GetMapping("/ricezone/searchzone")
    public Page<EmployeeZoneDTO> searchZone(@RequestParam(value = "page") int page, @RequestParam(value = "size") int size,
                                            @RequestParam(value = "search", required = false) String search) {
        return zoneService.getSearchNameAndLocationZone(page, size, "size", false, search);
    }
}
