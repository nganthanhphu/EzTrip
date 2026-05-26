/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.booking;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.hp.dto.review.ReviewViewDTO;

/**
 *
 * @author Joon
 */
public record BookingViewDTO(
        Integer id,
        String serviceName,
        @JsonFormat(timezone = "Asia/Ho_Chi_Minh", pattern = "dd/MM/yyyy HH:mm") Date createdDate,
        @JsonFormat(timezone = "Asia/Ho_Chi_Minh", pattern = "dd/MM/yyyy") Date bookingDay,
        int quantity,
        int totalAmount,
        String note,
        String status,
        String customerName,
        String customerPhone,
        String customerAvatar,
        String paymentMethod,
        ReviewViewDTO review
) {
}
