package org.group5.swp391.Controller;

import org.group5.swp391.DTO.Request.AuthenticationRequest;
import org.group5.swp391.DTO.Response.ApiResponse;
import org.group5.swp391.DTO.Response.AuthenticationResponse;
import org.group5.swp391.Service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthenticationAPI {
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping(value = "/login")
    public AuthenticationResponse login(@RequestBody AuthenticationRequest authenticationRequest) {
        AuthenticationResponse authenticationResponse = authenticationService.authenticate(authenticationRequest);
        return authenticationResponse;
    }
}
