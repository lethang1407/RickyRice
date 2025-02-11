package org.group5.swp391.Controller.EmployeeController;


import lombok.Data;
import org.group5.swp391.DTO.EmployeeDTO.CategoryDTO;
import org.group5.swp391.DTO.EmployeeDTO.zoneDTO;
import org.group5.swp391.Service.EmployeeService.ZoneService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/home/owner")
@Data
public class ZoneController {


    private final ZoneService zoneService;


    @GetMapping("/ricezone")
    public Page<zoneDTO> getFilterZones( @RequestParam("page") int page,@RequestParam("size") int size,
            @RequestParam(value = "quantityMin", required = false) Integer quantityMin,
            @RequestParam(value = "quantityMax", required = false) Integer quantityMax,
            @RequestParam(value = "sizeMin", required = false) Integer sizeMin,
            @RequestParam(value = "sizeMax", required = false) Integer sizeMax
    ) {
        return zoneService.getFilterZones(page,size,"size",false,quantityMin,quantityMax,sizeMin,sizeMax);
    }

    @GetMapping("/ricezone/searchzone")
    public Page<zoneDTO> searchZone(@RequestParam(value = "page") int page,@RequestParam(value = "size") int size,
            @RequestParam(value = "search", required = false) String search ) {
        return zoneService.getSearchNameAndLocationZone(page,size,"size",false,search);
    }
}
