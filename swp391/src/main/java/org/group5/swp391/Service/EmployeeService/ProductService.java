package org.group5.swp391.Service.EmployeeService;


import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.EmployeeDTO.CategoryDTO;
import org.group5.swp391.DTO.EmployeeDTO.ProductDTO;
import org.group5.swp391.DTO.EmployeeDTO.zoneDTO;
import org.group5.swp391.Entity.Product;
import org.group5.swp391.Entity.Zone;
import org.group5.swp391.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    @Autowired
    private final ProductRepository productRepository;


    private long calculateTotalQuantityFromZones(Product product) {
        if (product.getZones() == null || product.getZones().isEmpty()) {
            return 0;
        }

        return product.getZones().stream()
                .mapToLong(Zone::getQuantity)
                .sum();
    }

    public ProductDTO convertToProductDTO(Product product) {

        ProductDTO productDTO = new ProductDTO();


        productDTO.setProductID(product.getProductID());
        productDTO.setName(product.getName());
        productDTO.setPrice(product.getPrice());
        productDTO.setInformation(product.getInformation());
        productDTO.setProductImage(product.getProductImage());
        productDTO.setQuantity(calculateTotalQuantityFromZones(product));


        if (product.getCategory() != null) {
            CategoryDTO categoryDTO = new CategoryDTO();
            categoryDTO.setCategoryID(product.getCategory().getCategoryID());
            categoryDTO.setName(product.getCategory().getName());
            categoryDTO.setDescription(product.getCategory().getDescription());
            productDTO.setCategoryDTO(categoryDTO);
        }


        if(product.getZones() != null) {
            List<zoneDTO>zoneDTOList=  product.getZones().stream()
                    .map(zone -> {

                        zoneDTO zoneDTO=new zoneDTO();
                        zoneDTO.setZoneID(zone.getZoneID());
                        zoneDTO.setName(zone.getName());
                        zoneDTO.setName(zone.getName());
                        zoneDTO.setQuantity(zone.getQuantity());
                        zoneDTO.setSize(zone.getSize());
                        return zoneDTO;
                    }).collect(Collectors.toList());

            productDTO.setZonesetDTOList(zoneDTOList);
        }

        return productDTO;
    }


    public Page<ProductDTO> getProductsByCateID(String CateID, int page, int size, String sortBy, boolean descending) {
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> productPage = productRepository.findAllByCategoryId(pageable, CateID);
        return productPage.map(this::convertToProductDTO);
    }

   public Page<ProductDTO>getProductBySearch(String name,String categoryID, int page, int size, String sortBy, boolean descending){
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> productPage = productRepository.findByNameIgnoreCase(name,categoryID, pageable);
        return productPage.map(this::convertToProductDTO);
   }




}
