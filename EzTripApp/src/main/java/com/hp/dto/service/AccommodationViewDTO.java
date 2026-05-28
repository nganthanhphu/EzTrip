/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.service;

import java.math.BigDecimal;

/**
 *
 * @author Joon
 */
public record AccommodationViewDTO(
                BaseServiceViewDTO baseInfo,
                Integer id,
                int quantityOfBed,
                float area,
                String location) {
        public AccommodationViewDTO(Integer baseId, String name, String description, BigDecimal price, Integer quantity,
                        Integer remainingQuantity, Double avgRating, Long reviewCount, Long bookingCount,
                        Integer companyId, String companyName, String companyAvatar, String companyAddress,
                        String companyPhone, String companyEmail, Integer id, int quantityOfBed, float area,
                        String location) {
                this(new BaseServiceViewDTO(baseId, name, description, price, quantity, remainingQuantity, avgRating,
                                reviewCount, bookingCount, companyId, companyName, companyAvatar, companyAddress,
                                companyPhone, companyEmail), id, quantityOfBed,
                                area, location);
        }
}
