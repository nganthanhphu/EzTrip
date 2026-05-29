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
                Integer serviceType,
                String serviceImage,
                @JsonFormat(timezone = "Asia/Ho_Chi_Minh", pattern = "dd/MM/yyyy HH:mm") Date createdDate,
                @JsonFormat(timezone = "Asia/Ho_Chi_Minh", pattern = "dd/MM/yyyy") Date bookingDay,
                int quantity,
                int totalAmount,
                String note,
                Integer status,
                Integer customerId,
                String customerName,
                String customerPhone,
                String customerAvatar,
                Integer companyId,
                String companyName,
                Integer paymentMethod,
                ReviewViewDTO review) {
        public BookingViewDTO(Integer id, String serviceName, Integer serviceType, String serviceImage, Date createdDate, Date bookingDay, int quantity,
                        int totalAmount, String note, Integer status, Integer customerId, String customerName, String customerPhone,
                        String customerAvatar, Integer companyId, String companyName, Integer paymentMethod, Integer reviewId, Integer reviewRating,
                        String reviewComment, Date reviewDate) {
                this(id, serviceName, serviceType, serviceImage, createdDate, bookingDay, quantity, totalAmount, note, status, customerId, customerName,
                                customerPhone, customerAvatar, companyId, companyName, paymentMethod,
                                reviewId != null ? new ReviewViewDTO(reviewId, reviewRating, reviewComment, reviewDate)
                                                : null);
        }
}
