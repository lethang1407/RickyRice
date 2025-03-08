package org.group5.swp391.service.impl;

import org.group5.swp391.utils.CurrentUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service("securityService")
public class SecurityService {

    public boolean hasAccessToStore(String storeId) {
        if(!StringUtils.hasLength(storeId)) return true;
        List<String> storeList = CurrentUserDetails.getCurrentStores();
        return storeList.contains(storeId);
    }

}
