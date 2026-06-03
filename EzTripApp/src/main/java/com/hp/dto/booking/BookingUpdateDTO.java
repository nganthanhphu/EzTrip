/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Record.java to edit this template
 */
package com.hp.dto.booking;

import jakarta.validation.constraints.NotBlank;

/**
 *
 * @author Joon
 */
public record BookingUpdateDTO(
    @NotBlank(message = "Trạng thái không được để trống")
    String status
) {

}
