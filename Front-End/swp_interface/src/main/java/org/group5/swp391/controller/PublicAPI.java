package org.group5.swp391.controller;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.response.AdminResponse.SubscriptionPlanResponse;
import org.group5.swp391.dto.response.ApiResponse;
import org.group5.swp391.repository.CategoryRepository;
import org.group5.swp391.service.SubscriptionPlanService;
import org.group5.swp391.utils.CloudinaryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class PublicAPI {
    private final CloudinaryService cloudinaryService;
    private final CategoryRepository categoryRepository;
    private final SubscriptionPlanService subscriptionPlanService;

    @GetMapping(value = "/category")
    public void getCategory() {
        categoryRepository.findAll()
                .forEach((item) -> System.out.println(item.getName()));
    }

    @PostMapping(value = "/image")
    public ApiResponse<String> uploadFile(
            @RequestPart("file") MultipartFile file) throws IOException {
        String url = cloudinaryService.uploadFile(file);
        return ApiResponse.<String>builder()
                .code(200)
                .data(url)
                .message("Uploaded image to Cloudinary")
                .build();
    }

    @GetMapping("/service-web")
    public ApiResponse<List<SubscriptionPlanResponse>> getSubscriptionPlansIsActive() {
        List<SubscriptionPlanResponse> plans = subscriptionPlanService.getSubscriptionPlansIsActive();
        return ApiResponse.<List<SubscriptionPlanResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Fetched subscription plans successfully")
                .data(plans)
                .build();
    }

    @PostMapping("/send-email")
    public ApiResponse<Void> sendEmail(){
        return ApiResponse.<Void>builder()
                .build();
    }
}
