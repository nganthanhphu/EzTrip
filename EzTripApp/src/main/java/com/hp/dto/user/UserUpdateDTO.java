/*
* Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
* Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Record.java to edit this template
*/
package com.hp.dto.user;

import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author Joon
 */
public record UserUpdateDTO(
        String fullname,
        String email,
        String oldPassword,
        String newPassword,
        Integer gender,
        String dob,
        String companyName,
        String companyAddress,
        MultipartFile avatar) {

}
