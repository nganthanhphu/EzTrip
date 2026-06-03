/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 *
 * @author Joon
 */
public record TransportationCreateDTO(
        @NotNull(message = "Các thông tin cơ bản không được để trống")
        @Valid
        BaseServiceCreateDTO baseInfo,
        @NotBlank(message = "Điểm đến không được để trống")
        String arrivalLocation,
        @NotBlank(message = "Điểm đón đi không được để trống")
        String departureLocation,
        @NotNull(message = "Thời gian đến không được để trống")
        @Min(value = 0, message = "Thời gian đến phải là số từ 0 đến 23")
        @Max(value = 23, message = "Thời gian đến phải là số từ 0 đến 23")
        Integer arrivalTime,
        @NotNull(message = "Thời gian đón không được để trống")
        @Min(value = 0, message = "Thời gian đón phải là số từ 0 đến 23")
        @Max(value = 23, message = "Thời gian đón phải là số từ 0 đến 23")
        Integer departureTime,
        @NotNull(message = "Loại phương tiện không được để trống")
        Integer typeOfTransportation
) {
}
