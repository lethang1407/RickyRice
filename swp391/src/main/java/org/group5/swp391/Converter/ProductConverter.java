package org.group5.swp391.Converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.CustomerRequirementDTO.CustomerCategoryDTO;
import org.group5.swp391.DTO.CustomerRequirementDTO.CustomerProductAttributeDTO;
import org.group5.swp391.DTO.CustomerRequirementDTO.CustomerProductDTO;
import org.group5.swp391.DTO.CustomerRequirementDTO.CustomerZoneDTO;
import org.group5.swp391.DTO.EmployeeDTO.EmployeeCategoryDTO;
import org.group5.swp391.DTO.EmployeeDTO.EmployeeProductDTO;
import org.group5.swp391.DTO.EmployeeDTO.EmployeeZoneDTO;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreProductDTO;
import org.group5.swp391.Entity.Product;
import org.group5.swp391.Entity.Zone;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductConverter {
    private final ModelMapper modelMapper;
    private final ProductAttributeConverter productAttributeConverter;
    private final ZoneConverter zoneConverter;
    private final CategoryConverter categoryConverter;

    public CustomerProductDTO toCustomerProductDTO(Product product) {
        CustomerProductDTO customerProductDTO = modelMapper.map(product, CustomerProductDTO.class);
        List<CustomerProductAttributeDTO> pads = product.getProductAttributes().stream().map(productAttributeConverter::toProductAttributeDTO).collect(Collectors.toList());
        customerProductDTO.setProductAttributes(pads);

        List<CustomerZoneDTO> zds = product.getZones().stream().map(zoneConverter::toZoneDTO).collect(Collectors.toList());
        customerProductDTO.setZones(zds);

        CustomerCategoryDTO cd = categoryConverter.toCategoryDTO(product.getCategory());
        customerProductDTO.setCustomerCategoryDTO(cd);
        return customerProductDTO;
    }

    public StoreProductDTO toStoreProductDTO(Product product){
        StoreProductDTO storeProductDTO = modelMapper.map(product, StoreProductDTO.class);
        storeProductDTO.setCategoryName(product.getCategory().getName());
        return storeProductDTO;
    }

    private long calculateTotalQuantityFromZones(Product product) {
        if (product.getZones() == null || product.getZones().isEmpty()) {
            return 0;
        }

        return product.getZones().stream()
                .mapToLong(Zone::getQuantity)
                .sum();
    }

    public EmployeeProductDTO toEmployeeProductDTO(Product product) {

        EmployeeProductDTO employeeProductDTO = new EmployeeProductDTO();

        employeeProductDTO.setProductID(product.getProductID());
        employeeProductDTO.setName(product.getName());
        employeeProductDTO.setPrice(product.getPrice());
        employeeProductDTO.setInformation(product.getInformation());
        employeeProductDTO.setProductImage(product.getProductImage());
        employeeProductDTO.setQuantity(calculateTotalQuantityFromZones(product));

        if (product.getCategory() != null) {
            EmployeeCategoryDTO employeeCategoryDTO = new EmployeeCategoryDTO();
            employeeCategoryDTO.setCategoryID(product.getCategory().getCategoryID());
            employeeCategoryDTO.setName(product.getCategory().getName());
            employeeCategoryDTO.setDescription(product.getCategory().getDescription());
            employeeProductDTO.setEmployeeCategoryDTO(employeeCategoryDTO);
        }

        if(product.getZones() != null) {
            List<EmployeeZoneDTO> employeeZoneDTOList =  product.getZones().stream()
                    .map(zone -> {
                        EmployeeZoneDTO EmployeeZoneDTO =new EmployeeZoneDTO();
                        EmployeeZoneDTO.setZoneID(zone.getZoneID());
                        EmployeeZoneDTO.setName(zone.getName());
                        EmployeeZoneDTO.setName(zone.getName());
                        EmployeeZoneDTO.setQuantity(zone.getQuantity());
                        EmployeeZoneDTO.setSize(zone.getSize());
                        return EmployeeZoneDTO;
                    }).collect(Collectors.toList());

            employeeProductDTO.setZonesetDTOList(employeeZoneDTOList);
        }

        return employeeProductDTO;
    }
}
