package org.group5.swp391.service.impl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.request.admin_request.SubscriptionPlanRequest;
import org.group5.swp391.dto.response.AdminResponse.SubscriptionPlanResponse;
import org.group5.swp391.entity.SubscriptionPlan;
import org.group5.swp391.repository.SubscriptionPlanRepository;
import org.group5.swp391.service.SubscriptionPlanService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionPlanServiceImpl implements SubscriptionPlanService {

    private final SubscriptionPlanRepository subscriptionPlanRepository;

    // lấy danh sách các gói dịch vụ đăng kí của trang web
    public List<SubscriptionPlanResponse> getAllSubscriptionPlans() {
        return subscriptionPlanRepository.findAll().stream()
                .map(plan -> SubscriptionPlanResponse.builder()
                        .subscriptionPlanID(plan.getId())
                        .name(plan.getName())
                        .description(plan.getDescription())
                        .price(plan.getPrice())
                        .timeOfExpiration(plan.getTimeOfExpiration())
                        .build())
                .collect(Collectors.toList());
    }

    // tìm gói dịch vụ đăng kí của trang web theo ID
    public SubscriptionPlanResponse getSubscriptionPlanById(String id) {
        SubscriptionPlan plan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription Plan not found"));
        return SubscriptionPlanResponse.builder()
                .subscriptionPlanID(plan.getId())
                .name(plan.getName())
                .description(plan.getDescription())
                .price(plan.getPrice())
                .timeOfExpiration(plan.getTimeOfExpiration())
                .build();
    }

    // tạo mới 1 gói đăng kí
    public SubscriptionPlanResponse createSubscriptionPlan(SubscriptionPlanRequest request) {
        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setName(request.getName());
        plan.setDescription(request.getDescription());
        plan.setPrice(request.getPrice());
        plan.setTimeOfExpiration(request.getTimeOfExpiration());

        SubscriptionPlan savedPlan = subscriptionPlanRepository.save(plan);
        return SubscriptionPlanResponse.builder()
                .subscriptionPlanID(savedPlan.getId())
                .name(savedPlan.getName())
                .description(savedPlan.getDescription())
                .price(savedPlan.getPrice())
                .timeOfExpiration(savedPlan.getTimeOfExpiration())
                .build();
    }

    // cập nhật 1 gói đăng kí
    public SubscriptionPlanResponse updateSubscriptionPlan(String id, SubscriptionPlanRequest request) {
        SubscriptionPlan plan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription Plan not found"));

        plan.setName(request.getName());
        plan.setDescription(request.getDescription());
        plan.setPrice(request.getPrice());
        plan.setTimeOfExpiration(request.getTimeOfExpiration());

        SubscriptionPlan updatedPlan = subscriptionPlanRepository.save(plan);
        return SubscriptionPlanResponse.builder()
                .subscriptionPlanID(updatedPlan.getId())
                .name(updatedPlan.getName())
                .description(updatedPlan.getDescription())
                .price(updatedPlan.getPrice())
                .timeOfExpiration(updatedPlan.getTimeOfExpiration())
                .build();
    }
}
