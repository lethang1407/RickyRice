package org.group5.swp391.repository.client;

import org.group5.swp391.dto.response.AuthenticationResponse.UserInfoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "outbound-user", url = "https://www.googleapis.com")
public interface UserInfoClient {
    @GetMapping(value = "/oauth2/v1/userinfo")
    UserInfoResponse getUserInfo(@RequestParam("alt") String alt, @RequestParam("access_token") String token);
}
