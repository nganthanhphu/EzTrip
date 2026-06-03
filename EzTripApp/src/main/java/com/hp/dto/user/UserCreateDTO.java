/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.user;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

/**
 *
 * @author Joon
 */
public record UserCreateDTO(
        @NotBlank(message = "Họ và tên không được để trống") String fullname,
        @NotBlank(message = "Email không được để trống") @Email(message = "Email không hợp lệ") String email,
        @NotBlank(message = "Số điện thoại không được để trống") String phoneNumber,
        @NotBlank(message = "Mật khẩu không được để trống")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$", message = "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm cả chữ hoa, chữ thường và số") String password,
        @NotNull(message = "Vai trò không được để trống") Integer role,
        Integer gender,
        String dob,
        String companyName,
        String companyAddress,
        Integer typeOfProvider,
        @NotNull(message = "Ảnh đại diện không được để trống") MultipartFile avatar) {
}
