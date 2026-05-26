/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.user;

/**
 *
 * @author Joon
 */
public record ProviderViewDTO(
        Integer id,
        String companyName,
        String companyAddress,
        String typeOfProvider
) {
}
