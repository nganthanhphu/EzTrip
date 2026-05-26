/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.user;

import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author Joon
 */
public record UserCreateDTO(
        String fullname,
        String email,
        String phoneNumber,
        String password,
        String role,
        String gender,
        String dob,
        String companyName,
        String companyAddress,
        String typeOfProvider,
        MultipartFile avatar
) {
}
