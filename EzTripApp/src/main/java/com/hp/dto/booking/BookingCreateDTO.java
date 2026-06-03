/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.booking;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 *
 * @author Joon
 */
public record BookingCreateDTO(
        @NotNull(message = "Dịch vụ không được để trống")
        Integer serviceId,
        @NotNull(message = "Phương thức thanh toán không được để trống")
        Integer paymentMethodId,
        @NotBlank(message = "Ngày đặt chỗ không được để trống")
        String bookingDay,
        @NotNull(message = "Số lượng không được để trống")
        @Positive(message = "Số lượng phải là số dương")
        Integer quantity,
        String note
) {
}
