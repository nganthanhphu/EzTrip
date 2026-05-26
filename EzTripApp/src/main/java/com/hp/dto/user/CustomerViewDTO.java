/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.user;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 *
 * @author Joon
 */
public record CustomerViewDTO(
        Integer id,
        @JsonFormat(timezone = "Asia/Ho_Chi_Minh", pattern = "dd-MM-yyyy") Date dob,
        String gender
) {
}
