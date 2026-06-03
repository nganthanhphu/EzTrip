/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Record.java to edit this template
 */
package com.hp.dto.payment;

/**
 *
 * @author Joon
 */
public record ZaloPayCreateResponseDTO(
        int return_code,
        String return_message,
        int sub_return_code,
        String sub_return_message,
        String zp_trans_token,
        String order_url,
        String order_token,
        String qr_code
) {

}

