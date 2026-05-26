/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author Joon
 */
public record BaseServiceCreateDTO(
        String name,
        String description,
        BigDecimal price,
        Integer quantity,
        List<MultipartFile> imgFiles
) {
}
