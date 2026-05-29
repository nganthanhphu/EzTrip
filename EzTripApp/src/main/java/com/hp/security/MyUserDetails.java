/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.security;

import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

/**
 *
 * @author Joon
 */
public class MyUserDetails extends User{
    private Integer id;
    private Integer customerId;
    private Integer providerId;

    public MyUserDetails(Integer id, Integer customerId, Integer providerId, String username, String password, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.id = id;
        this.customerId = customerId;
        this.providerId = providerId;
    }

    public MyUserDetails(Integer id, Integer customerId, Integer providerId, String username, String password, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired, boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
        this.id = id;
        this.customerId = customerId;
        this.providerId = providerId;
    }

    /**
     * @return the id
     */
    public Integer getId() {
        return id;
    }

    /**
     * @return the customerId
     */
    public Integer getCustomerId() {
        return customerId;
    }

    /**
     * @return the providerId
     */
    public Integer getProviderId() {
        return providerId;
    }

}
