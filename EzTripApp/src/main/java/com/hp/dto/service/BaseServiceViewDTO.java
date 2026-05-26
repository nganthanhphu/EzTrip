/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.service;

import java.math.BigDecimal;
import java.util.Set;

/**
 *
 * @author Joon
 */
public record BaseServiceViewDTO(
        Integer id,
        String name,
        String description,
        BigDecimal price,
        Integer quantity,
        Integer remainingQuantity,
        Set<String> images,
        Double avgRating,
        Long reviewCount,
        Long bookingCount,
        String companyName,
        String companyAddress,
        String companyPhone,
        String companyEmail
) {
    public BaseServiceViewDTO(Integer id, String name, String description, BigDecimal price, Integer quantity,
            Integer remainingQuantity, Double avgRating, Long reviewCount, Long bookingCount, String companyName,
            String companyAddress, String companyPhone, String companyEmail) {
        this(id, name, description, price, quantity, remainingQuantity, null, avgRating, reviewCount, bookingCount,
                companyName, companyAddress, companyPhone, companyEmail);
    }

    public BaseServiceViewDTO setImages(Set<String> images) {
        return new BaseServiceViewDTO(id, name, description, price, quantity, remainingQuantity, images, avgRating,
                reviewCount, bookingCount, companyName, companyAddress, companyPhone, companyEmail);
    }
}
