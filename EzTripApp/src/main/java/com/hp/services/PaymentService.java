/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services;

import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;

/**
 *
 * @author Joon
 */
public interface PaymentService {
    String createPaymentLink(int bookingId, String redirectUrl) throws JsonProcessingException;

    void handlePaymentResult(Map<String, String> ipnRequest, String paymentMethod);
}
