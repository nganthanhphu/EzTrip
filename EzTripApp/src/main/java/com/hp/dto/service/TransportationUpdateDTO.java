/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Record.java to edit this template
 */
package com.hp.dto.service;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

/**
 *
 * @author Joon
 */
public record TransportationUpdateDTO(
                BaseServiceUpdateDTO baseInfo,
                String arrivalLocation,
                String departureLocation,
                @Min(value = 0, message = "Thời gian đến phải là số từ 0 đến 23")
                @Max(value = 23, message = "Thời gian đến phải là số từ 0 đến 23")
                Integer arrivalTime,
                @Min(value = 0, message = "Thời gian đón phải là số từ 0 đến 23")
                @Max(value = 23, message = "Thời gian đón phải là số từ 0 đến 23")
                Integer departureTime,
                Integer typeOfTransportation) {

}
