package org.group5.swp391.service;

import org.group5.swp391.dto.request.admin_request.SubscriptionPlanRequest;
import org.group5.swp391.dto.response.AdminResponse.SubscriptionPlanResponse;
import org.group5.swp391.entity.SubscriptionPlan;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface SubscriptionPlanService {
    public List<SubscriptionPlanResponse> getAllSubscriptionPlans();
    public SubscriptionPlanResponse getSubscriptionPlanById(String id);
    public SubscriptionPlanResponse createSubscriptionPlan(SubscriptionPlanRequest request);
    public SubscriptionPlanResponse updateSubscriptionPlan(String id, SubscriptionPlanRequest request);
    public List<SubscriptionPlanResponse> getSubscriptionPlansIsActive();
    SubscriptionPlan getSubscriptionPlanByPrice(double price);
}
