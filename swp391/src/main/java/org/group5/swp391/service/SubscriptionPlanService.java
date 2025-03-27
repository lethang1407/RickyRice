package org.group5.swp391.service;

import org.group5.swp391.dto.request.admin_request.SubscriptionPlanRequest;
import org.group5.swp391.dto.response.AdminResponse.SubscriptionPlanResponse;
import org.group5.swp391.entity.SubscriptionPlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface SubscriptionPlanService {
    public SubscriptionPlanResponse getSubscriptionPlanById(String id);
    public SubscriptionPlanResponse createSubscriptionPlan(SubscriptionPlanRequest request);
    public SubscriptionPlanResponse updateSubscriptionPlan(String id, SubscriptionPlanRequest request);
    public List<SubscriptionPlanResponse> getSubscriptionPlansIsActive();
    SubscriptionPlan getSubscriptionPlanByPrice(double price);
    Map<String, Object> getSubscriptionPlans(String name, Pageable pageable);

}
