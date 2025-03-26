package org.group5.swp391.utils;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {
    private final String username;
    private final List<String> storeList;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(String username, Collection<? extends GrantedAuthority> authorities, List<String> storeList) {
        this.username = username;
        this.storeList = storeList;
        this.authorities = authorities;
    }

    public List<String> getStoreList() {
        return storeList;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return null; // Vì không cần mật khẩu trong JWT
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

}
