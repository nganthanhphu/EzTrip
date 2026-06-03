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
public record TourismCreateDTO(
        @NotNull(message = "Các thông tin cơ bản không được để trống")
        @Valid
        BaseServiceCreateDTO baseInfo,
        @NotNull(message = "Thời lượng tour không được để trống")
        @Positive(message = "Thời lượng tour phải là số dương")
        Integer tourDuration,
        @NotBlank(message = "Địa điểm không được để trống")
        String location
) {
}
