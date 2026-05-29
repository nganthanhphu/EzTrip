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
public record TransportationViewDTO(
                BaseServiceViewDTO baseInfo,
                Integer id,
                String arrivalLocation,
                String departureLocation,
                int arrivalTime,
                int departureTime,
                Integer typeOfTransportation) {
        public TransportationViewDTO(Integer baseId, String name, String description, BigDecimal price,
                        Integer quantity,
                        Integer remainingQuantity, Double avgRating, Long reviewCount, Long bookingCount,
                        Integer companyId, String companyName, String companyAvatar, String companyAddress,
                        String companyPhone, String companyEmail, Integer id, String arrivalLocation,
                        String departureLocation, int arrivalTime, int departureTime, Integer typeOfTransportation) {
                this(new BaseServiceViewDTO(baseId, name, description, price, quantity, remainingQuantity, avgRating,
                                reviewCount, bookingCount, companyId, companyName, companyAvatar, companyAddress,
                                companyPhone, companyEmail), id, arrivalLocation,
                                departureLocation, arrivalTime, departureTime, typeOfTransportation);
        }

        
}
