package org.group5.swp391.Service;

import org.group5.swp391.DTO.Request.AdminRequest.SubscriptionPlanRequest;
import org.group5.swp391.DTO.Response.AdminResponse.SubscriptionPlanResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface SubscriptionPlanService {
    public List<SubscriptionPlanResponse> getAllSubscriptionPlans();
    public SubscriptionPlanResponse getSubscriptionPlanById(String id);
    public SubscriptionPlanResponse createSubscriptionPlan(SubscriptionPlanRequest request);
    public SubscriptionPlanResponse updateSubscriptionPlan(String id, SubscriptionPlanRequest request);
}
