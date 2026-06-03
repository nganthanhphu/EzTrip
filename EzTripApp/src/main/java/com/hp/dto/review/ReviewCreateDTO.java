/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Record.java to edit this template
 */
package com.hp.dto.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 *
 * @author Joon
 */
public record ReviewCreateDTO(
        @NotNull(message = "Dịch vụ không được để trống")
        @Min(value = 1, message = "Điểm đánh giá phải lớn hơn hoặc bằng 1")
        @Max(value = 10, message = "Điểm đánh giá phải nhỏ hơn hoặc bằng 10")
        Integer rating,
        String comment) {

}
