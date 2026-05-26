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
public record BaseServiceListViewDTO(
        Integer id,
        String name,
        BigDecimal price,
        String image,
        Integer quantity,
        Integer remainingQuantity,
        Double avgRating,
        Long reviewCount,
        Long bookingCount,
        String companyName
) {
}
