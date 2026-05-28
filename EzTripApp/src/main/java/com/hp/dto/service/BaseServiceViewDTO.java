/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.service;

import java.math.BigDecimal;
import java.util.Set;

import com.hp.dto.image.ImageViewDTO;

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
                Set<ImageViewDTO> images,
                Double avgRating,
                Long reviewCount,
                Long bookingCount,
                ProviderInfoDTO providerInfo) {
        public BaseServiceViewDTO(Integer id, String name, String description, BigDecimal price, Integer quantity,
                        Integer remainingQuantity, Double avgRating, Long reviewCount, Long bookingCount,
                        Integer companyId,
                        String companyName,
                        String companyAvatar,
                        String companyAddress,
                        String companyPhone,
                        String companyEmail) {
                this(id, name, description, price, quantity, remainingQuantity, null, avgRating, reviewCount,
                                bookingCount,
                                new ProviderInfoDTO(companyId, companyName, companyAvatar, companyAddress, companyPhone, companyEmail));
        }

        public BaseServiceViewDTO setImages(Set<ImageViewDTO> images) {
                return new BaseServiceViewDTO(id, name, description, price, quantity, remainingQuantity, images,
                                avgRating,
                                reviewCount, bookingCount, providerInfo);
        }
}
