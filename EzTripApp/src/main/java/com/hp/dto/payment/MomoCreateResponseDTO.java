/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Record.java to edit this template
 */
package com.hp.dto.payment;

/**
 *
 * @author Joon
 */
public record MomoCreateResponseDTO(
        String partnerCode,
        String orderId,
        String requestId,
        Long amount,
        Long responseTime,
        String message,
        int resultCode,
        String payUrl,
        String deeplink,
        String qrCodeUrl
) {

}