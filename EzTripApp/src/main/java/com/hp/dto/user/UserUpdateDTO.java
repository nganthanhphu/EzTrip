/*
* Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
* Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Record.java to edit this template
*/
package com.hp.dto.user;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

/**
 *
 * @author Joon
 */
public record UserUpdateDTO(
                String fullname,
                @Email(message = "Email không hợp lệ")
                String email,
                String oldPassword,
                @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$", message = "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm cả chữ hoa, chữ thường và số") String newPassword,
                Integer gender,
                String dob,
                String companyName,
                String companyAddress,
                MultipartFile avatar) {

}
