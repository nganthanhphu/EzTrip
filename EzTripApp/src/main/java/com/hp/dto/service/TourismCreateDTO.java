/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.service;

/**
 *
 * @author Joon
 */
public record TourismCreateDTO(
        BaseServiceCreateDTO baseInfo,
        int tourDuration,
        String location
) {
}
