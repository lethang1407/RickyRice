package org.group5.swp391.config;

import org.group5.swp391.utils.CustomUserDetails;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.*;

public class CustomJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        String username = jwt.getSubject();
        String role = jwt.getClaim("scope");
        String store = jwt.getClaim("store");
        List<String> storeList = Arrays.stream(store.split(" ")).toList();

        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(role));

        UserDetails userDetails = new CustomUserDetails(username, authorities, storeList);

        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(userDetails, jwt, authorities);

        Map<String, Object> extraDetails = new HashMap<>();
        extraDetails.put("store", storeList);
        authenticationToken.setDetails(extraDetails);

        return authenticationToken;
    }
}
