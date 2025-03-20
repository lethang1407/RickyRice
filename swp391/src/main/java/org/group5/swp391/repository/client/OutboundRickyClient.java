package org.group5.swp391.repository.client;

import feign.QueryMap;
import org.group5.swp391.dto.request.authentication_request.OutboundAuthenticationRequest;
import org.group5.swp391.dto.response.AuthenticationResponse.OutboundAuthenticationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "outbound-regera", url = "https://oauth2.googleapis.com")
public interface OutboundRickyClient {
    @PostMapping(value = "/token", produces = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    OutboundAuthenticationResponse exchange(@QueryMap OutboundAuthenticationRequest request);
}
