/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 *
 * @author Joon
 */
public record AccommodationCreateDTO(
        @NotNull(message = "Các thông tin cơ bản không được để trống")
        @Valid
        BaseServiceCreateDTO baseInfo,
        @NotNull(message = "Số lượng giường không được để trống")
        @Positive(message = "Số lượng giường phải là số dương")
        Integer quantityOfBed,
        @NotNull(message = "Diện tích không được để trống")
        @Positive(message = "Diện tích phải là số dương")
        Float area,
        @NotBlank(message = "Vị trí không được để trống")
        String location
) {
}
