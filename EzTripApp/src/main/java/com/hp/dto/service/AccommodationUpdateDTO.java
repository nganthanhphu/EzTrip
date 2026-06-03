/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Record.java to edit this template
 */
package com.hp.dto.service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;

/**
 *
 * @author Joon
 */
public record AccommodationUpdateDTO(
        @Valid
        BaseServiceUpdateDTO baseInfo,
        @Positive(message = "Số lượng giường phải là số dương")
        Integer quantityOfBed,
        @Positive(message = "Diện tích phải là số dương")
        Float area,
        String location) {

}
