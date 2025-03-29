package org.group5.swp391.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.packagee.PackageCreationRequest;
import org.group5.swp391.dto.packagee.PackageDTO;
import org.group5.swp391.dto.response.ApiResponse;
import org.group5.swp391.dto.response.PageResponse;
import org.group5.swp391.service.impl.PackageServiceImpl;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/package")
@RequiredArgsConstructor
public class PackageController {
    private final PackageServiceImpl packageService;

    @GetMapping("")
    public ApiResponse<PageResponse<PackageDTO>> getAllPackage(@RequestParam(defaultValue = "1") Integer pageNo,
                                                               @RequestParam(defaultValue = "10") Integer pageSize,
                                                               @RequestParam(required = false) String sortBy,
                                                               @RequestParam(defaultValue = "") String storeId,
                                                               @RequestParam(required = false) String name,
                                                               @RequestParam(required = false) Long quantity){
    PageResponse<PackageDTO> res = packageService.getPackages(pageNo, pageSize, sortBy, storeId, quantity, name);
    return ApiResponse.<PageResponse<PackageDTO>>builder()
            .data(res)
            .message("Get packages successfully")
            .code(200)
            .build();
    }

    @PostMapping("")
    public ApiResponse<Void> createPackage(@Valid @RequestBody PackageCreationRequest request){
        packageService.createPackage(request);
        return ApiResponse.<Void>builder()
                .code(201)
                .message("Create package successfully")
                .build();
    }
}
