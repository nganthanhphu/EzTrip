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
public record TransportationListViewDTO(
        BaseServiceListViewDTO baseInfo,
        String arrivalLocation,
        String departureLocation,
        int arrivalTime,
        int departureTime,
        String typeOfTransportation
) {
    public TransportationListViewDTO(Integer id, String name, BigDecimal price, String image, Integer quantity,
            Integer remainingQuantity, Double avgRating, Long reviewCount, Long bookingCount, String companyName,
            String arrivalLocation, String departureLocation, int arrivalTime, int departureTime,
            String typeOfTransportation) {
        this(new BaseServiceListViewDTO(id, name, price, image, quantity, remainingQuantity, avgRating, reviewCount,
                bookingCount, companyName), arrivalLocation, departureLocation, arrivalTime, departureTime,
                typeOfTransportation);
    }
}
