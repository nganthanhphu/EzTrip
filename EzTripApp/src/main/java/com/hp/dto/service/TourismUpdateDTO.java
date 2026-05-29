/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Record.java to edit this template
 */
package com.hp.dto.service;

/**
 *
 * @author Joon
 */
public record TourismUpdateDTO(
        BaseServiceUpdateDTO baseInfo,
        Integer tourDuration,
        String location) {

}
