package org.group5.swp391.controller.employee;


import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.employee.EmployeeProductAttributeDTO;
import org.group5.swp391.service.impl.ProductAttributeServiceImpl;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/employee")
@RequiredArgsConstructor
public class EmployeeAttributeController {
    private final ProductAttributeServiceImpl productAttributeService;

    @GetMapping("/attributeList")
    public List<EmployeeProductAttributeDTO> getAllAttribute(){
        return productAttributeService.getALLProductAttributes2();
    }
}
