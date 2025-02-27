package org.group5.swp391.dto.request.authentication_request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class IntrospectRequest {
    @NotNull
    private String token;
}
