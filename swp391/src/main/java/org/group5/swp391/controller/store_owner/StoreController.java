package org.group5.swp391.controller.store_owner;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.store_owner.store_detail.StoreDetailCategoryDTO;
import org.group5.swp391.dto.store_owner.store_detail.StoreDetailZoneDTO;
import org.group5.swp391.dto.store_owner.store_detail.StoreDetailProductDTO;
import org.group5.swp391.service.CategoryService;
import org.group5.swp391.service.ProductService;
import org.group5.swp391.service.ZoneService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/store-detail")
@RequiredArgsConstructor
public class StoreController {

    private final ZoneService zoneService;
    private final ProductService productService;
    private final CategoryService categoryService;

    @GetMapping("/zones")
    public Page<StoreDetailZoneDTO> getStoreZones(@RequestParam(value = "zoneName", required = false) String zoneName,
                                                  @RequestParam(value = "storeID") String storeID,
                                                  @RequestParam(value = "page", defaultValue = "0") int page,
                                                  @RequestParam(value = "size", defaultValue = "10") int size,
                                                  @RequestParam(defaultValue = "name") String sortBy,
                                                  @RequestParam(defaultValue = "false") boolean descending) throws Exception {
        if(zoneName == null || zoneName.isEmpty()) {
            return zoneService.getStoreZones(zoneName, storeID, page, size, sortBy, descending);
        }
        return zoneService.getStoreZones(zoneName.trim(), storeID, page, size, sortBy, descending);
    }

    @GetMapping("/products")
    public Page<StoreDetailProductDTO> getProducts(@RequestParam(value = "search", required = false) String search,
                                                   @RequestParam(value = "storeID") String storeID,
                                                   @RequestParam(value = "page", defaultValue = "0") int page,
                                                   @RequestParam(value = "size", defaultValue = "10") int size,
                                                   @RequestParam(defaultValue = "name") String sortBy,
                                                   @RequestParam(defaultValue = "false") boolean descending) throws Exception {
        if(search == null || search.isEmpty()) {
            return productService.getAllProductsByStoreID(search, storeID, page, size, sortBy, descending);
        }
        return productService.getAllProductsByStoreID(search.trim(), storeID, page, size, sortBy, descending);
    }

    @PostMapping("/products")
    public void createProduct(@RequestParam String storeID, @RequestBody StoreDetailProductDTO productDTO) throws Exception {
        try {
            productService.addProduct(storeID, productDTO);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    @GetMapping("/get-zone")
    public StoreDetailZoneDTO getZoneById(@RequestParam(value = "zoneID") String zoneID) {
        return zoneService.getZone(zoneID);
    }

    @PostMapping("/zones")
    public void addNewZone(@RequestBody StoreDetailZoneDTO storeZoneDTO) throws Exception {
        zoneService.addZone(storeZoneDTO);
    }

    @PutMapping("/zones/{zoneID}")
    public ResponseEntity<String> updateZone(@PathVariable String zoneID, @RequestBody StoreDetailZoneDTO updatedZone) {
        try {
            zoneService.updateZone(zoneID, updatedZone);
            return ResponseEntity.ok("Zone updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update zone.");
        }
    }

    @GetMapping("/categories")
    public List<StoreDetailCategoryDTO> getStoreCategory() {
        return categoryService.getStoreDetailCategory();
    }

}