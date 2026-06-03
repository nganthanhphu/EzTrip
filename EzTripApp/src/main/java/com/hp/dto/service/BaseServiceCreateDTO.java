/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

/**
 *
 * @author Joon
 */
public record BaseServiceCreateDTO(
        @NotBlank(message = "Tên dịch vụ không được để trống")
        String name,
        String description,
        @NotNull(message = "Giá không được để trống")
        @Positive(message = "Giá phải là số dương")
        BigDecimal price,
        @NotNull(message = "Số lượng không được để trống")
        @PositiveOrZero(message = "Số lượng phải là số không âm")
        Integer quantity,
        List<MultipartFile> imgFiles
) {
}
