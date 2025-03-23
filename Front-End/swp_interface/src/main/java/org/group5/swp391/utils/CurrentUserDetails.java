package org.group5.swp391.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Map;

public class CurrentUserDetails {
    public static List<String> getCurrentStores() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> details = (Map<String, Object>) auth.getDetails();
        List<String> stores = (List<String>) details.get("store");
        return stores;
    }
}
