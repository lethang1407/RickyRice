package org.group5.swp391.converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.customer_requirement.CustomerCategoryDTO;
import org.group5.swp391.dto.customer_requirement.CustomerProductAttributeDTO;
import org.group5.swp391.dto.customer_requirement.CustomerProductDTO;
import org.group5.swp391.dto.customer_requirement.CustomerZoneDTO;
import org.group5.swp391.dto.employee.EmployeeCategoryDTO;
import org.group5.swp391.dto.employee.EmployeeProductAttributeDTO;
import org.group5.swp391.dto.employee.EmployeeProductDTO;
import org.group5.swp391.dto.employee.EmployeeZoneDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreProductAttributeDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreProductDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreProductDetailDTO;
import org.group5.swp391.dto.store_owner.store_detail.StoreDetailProductDTO;
import org.group5.swp391.entity.Product;
import org.group5.swp391.entity.ProductAttribute;
import org.group5.swp391.entity.Zone;
import org.group5.swp391.exception.AppException;
import org.group5.swp391.exception.ErrorCode;
import org.group5.swp391.repository.CategoryRepository;
import org.group5.swp391.repository.ProductAttributeRepository;
import org.group5.swp391.repository.ZoneRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductConverter {
    private final ModelMapper modelMapper;
    private final ProductAttributeConverter productAttributeConverter;
    private final ZoneConverter zoneConverter;
    private final CategoryConverter categoryConverter;
    private final StoreConverter storeConverter;
    private final CategoryRepository categoryRepository;
    private final ProductAttributeRepository productAttributeRepository;
    private final ZoneRepository zoneRepository;

    public CustomerProductDTO toCustomerProductDTO(Product product) {
        CustomerProductDTO customerProductDTO = modelMapper.map(product, CustomerProductDTO.class);
        customerProductDTO.setProductID(product.getId());
        if(product.getProductAttributes()!=null){
            List<CustomerProductAttributeDTO> pads = product.getProductAttributes().stream().map(productAttributeConverter::toProductAttributeDTO).collect(Collectors.toList());
            customerProductDTO.setProductAttributes(pads);
        }

       if(product.getZones()!=null){
           List<CustomerZoneDTO> zds = product.getZones().stream().map(zoneConverter::toZoneDTO).collect(Collectors.toList());
           customerProductDTO.setZones(zds);
       }

       if(product.getCategory()!=null){
           CustomerCategoryDTO cd = categoryConverter.toCategoryDTO(product.getCategory());
           customerProductDTO.setCustomerCategoryDTO(cd);
       }
        return customerProductDTO;
    }

    public StoreProductDTO toStoreProductDTO(Product product){
        StoreProductDTO dto = modelMapper.map(product, StoreProductDTO.class);
        dto.setCategory(categoryConverter.toStoreCategoryIdAndName(product.getCategory()));
        dto.setProductID(product.getId());
        dto.setStore(storeConverter.toStoreInfoIdAndNameDTO(product.getStore()));
        dto.setQuantity(product.getQuantity());
        return dto;
    }

    public StoreProductDetailDTO toStoreProductDetailDTO(Product product){
        StoreProductDetailDTO dto = modelMapper.map(product, StoreProductDetailDTO.class);
        dto.setCategory(categoryConverter.toStoreCategoryIdAndName(product.getCategory()));
        dto.setProductID(product.getId());
        dto.setStore(storeConverter.toStoreInfoIdAndNameDTO(product.getStore()));
        List<StoreProductAttributeDTO> attributeDTOS = product.getProductAttributes().stream().map(productAttributeConverter::toStoreProductAttributeDTO).toList();
        dto.setAttributes(attributeDTOS);
        dto.setQuantity(product.getQuantity());
        dto.setZones(product.getZones().stream().map(zoneConverter::toStoreZoneIdAndNameDTO).collect(Collectors.toList()));
        return dto;
    }

    public EmployeeProductDTO toEmployeeProductDTO(Product product) {

        EmployeeProductDTO employeeProductDTO = new EmployeeProductDTO();

        employeeProductDTO.setProductID(product.getId());
        employeeProductDTO.setName(product.getName());
        employeeProductDTO.setPrice(product.getPrice());
        employeeProductDTO.setQuantity(product.getQuantity());
        employeeProductDTO.setInformation(product.getInformation());
        employeeProductDTO.setProductImage(product.getProductImage());
//        employeeProductDTO.setCreated_at(product.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
        employeeProductDTO.setUpdated_at(product.getUpdatedAt()!=null?product.getUpdatedAt().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli():0L);
        employeeProductDTO.setCreated_by(product.getCreatedBy());

        if (product.getCategory() != null) {
            EmployeeCategoryDTO employeeCategoryDTO = new EmployeeCategoryDTO();
            employeeCategoryDTO.setCategoryID(product.getCategory().getId());
            employeeCategoryDTO.setName(product.getCategory().getName());
            employeeCategoryDTO.setDescription(product.getCategory().getDescription());
            employeeProductDTO.setEmployeeCategoryDTO(employeeCategoryDTO);
        }
        if(product.getProductAttributes() != null) {
             List<EmployeeProductAttributeDTO> employeeProductAttributeDTOList=product.getProductAttributes()
                     .stream().map(productAttributeConverter::toEmpProductAttributeDTO).collect(Collectors.toList());
          employeeProductDTO.setEmployeeProductAttributeDTO(employeeProductAttributeDTOList);
        }
        if(product.getZones() != null) {
            List<EmployeeZoneDTO> employeeZoneDTOList =  product.getZones().stream()
                    .map(zone -> {
                        EmployeeZoneDTO EmployeeZoneDTO =new EmployeeZoneDTO();
                        EmployeeZoneDTO.setZoneID(zone.getId());
                        EmployeeZoneDTO.setName(zone.getName());
                        EmployeeZoneDTO.setName(zone.getName());
                        return EmployeeZoneDTO;
                    }).collect(Collectors.toList());

            employeeProductDTO.setZonesetDTOList(employeeZoneDTOList);
        }

        return employeeProductDTO;
    }

    public StoreDetailProductDTO toStoreDetailProductDTO(Product product){
        StoreDetailProductDTO dto = modelMapper.map(product, StoreDetailProductDTO.class);
        dto.setStoreDetailProductAttributeDTOList(product.getProductAttributes().stream().map(productAttributeConverter::toStoreDetailProductAttributeDTO).collect(Collectors.toList()));
        dto.setStoreDetailZoneDTOList(product.getZones().stream().map(zoneConverter::toStoreZoneDTO).collect(Collectors.toList()));
        dto.setProductAttributeList(product.getProductAttributes().stream().map(ProductAttribute::getId).toList());
        dto.setZoneList(product.getZones().stream().map(Zone::getId).toList());
        return dto;
    }

    public Product toProduct(StoreDetailProductDTO storeDetailProductDTO){
        Product product = modelMapper.map(storeDetailProductDTO, Product.class);
        product.setQuantity(storeDetailProductDTO.getQuantity());
        product.setCategory(categoryRepository.findById(storeDetailProductDTO.getCategoryID()).orElse(null));
        product.setProductImage(storeDetailProductDTO.getProductImage());
        product.setInformation(storeDetailProductDTO.getInformation());
        product.setPrice(storeDetailProductDTO.getPrice());
        product.setName(storeDetailProductDTO.getName());
        if(storeDetailProductDTO.getProductAttributeList() != null) {
            product.setProductAttributes(storeDetailProductDTO.getProductAttributeList().stream().map((producAttributeID) -> {
                return productAttributeRepository.findById(producAttributeID).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
            }).toList());
        }
        if(storeDetailProductDTO.getZoneList() != null) {
            product.setZones(storeDetailProductDTO.getZoneList().stream().map((zoneID) -> {
                return zoneRepository.findById(zoneID).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
            }).toList());
        }
        return product;
    }

}
