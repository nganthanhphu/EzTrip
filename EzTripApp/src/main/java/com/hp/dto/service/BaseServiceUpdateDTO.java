/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Record.java to edit this template
 */
package com.hp.dto.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

/**
 *
 * @author Joon
 */
public record BaseServiceUpdateDTO(
        String name,
        String description,
        @Positive(message = "Giá phải là số dương")
        BigDecimal price,
        @PositiveOrZero(message = "Số lượng phải là số không âm")
        Integer quantity,
        List<MultipartFile> imgFiles) {
}
