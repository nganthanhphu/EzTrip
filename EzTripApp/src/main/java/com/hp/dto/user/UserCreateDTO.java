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
        Integer role,
        Integer gender,
        String dob,
        String companyName,
        String companyAddress,
        Integer typeOfProvider,
        MultipartFile avatar
) {
}
