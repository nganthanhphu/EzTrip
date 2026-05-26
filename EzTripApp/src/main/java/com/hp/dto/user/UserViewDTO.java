/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.user;

/**
 *
 * @author Joon
 */
public record UserViewDTO(
        Integer id,
        String fullname,
        String email,
        String phoneNumber,
        String avatar,
        Boolean isActive,
        String role,
        CustomerViewDTO customerProfile,
        ProviderViewDTO providerProfile
) {
}
