/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Record.java to edit this template
 */
package com.hp.dto.service;

import jakarta.validation.constraints.Positive;

/**
 *
 * @author Joon
 */
public record TourismUpdateDTO(
        BaseServiceUpdateDTO baseInfo,
        @Positive(message = "Thời lượng tour phải là số dương")
        Integer tourDuration,
        String location) {

}
