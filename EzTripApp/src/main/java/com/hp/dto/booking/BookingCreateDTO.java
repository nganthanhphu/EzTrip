/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.booking;

/**
 *
 * @author Joon
 */
public record BookingCreateDTO(
        Integer serviceId,
        Integer paymentMethodId,
        String bookingDay,
        int quantity,
        String note
) {
}
