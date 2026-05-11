/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.user;

/**
 *
 * @author Joon
 */
public class UserViewDTO {

    private Integer id;
    private String fullname;
    private String email;
    private String phoneNumber;
    private String avatar;
    private Boolean isActive;
    private String role;
    private CustomerProfileDTO customerProfile;
    private ProviderProfileDTO providerProfile;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public CustomerProfileDTO getCustomerProfile() {
        return customerProfile;
    }

    public void setCustomerProfile(CustomerProfileDTO customerProfile) {
        this.customerProfile = customerProfile;
    }

    public ProviderProfileDTO getProviderProfile() {
        return providerProfile;
    }

    public void setProviderProfile(ProviderProfileDTO providerProfile) {
        this.providerProfile = providerProfile;
    }
}
