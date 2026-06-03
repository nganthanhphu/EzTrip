/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.handler.payment;

import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hp.pojo.Booking;

/**
 *
 * @author Joon
 */
public interface PaymentHandler {
    String createPaymentLink(Booking booking, String redirectUrl)  throws JsonProcessingException;
    
    void handlePaymentResult(Map<String, String> ipnRequest);
}
