/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.hp.services.PaymentService;

/**
 *
 * @author Joon
 */
@Controller
@RequestMapping("/api")
public class ApiPayController {

    @Autowired
    private PaymentService paymentService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/secure/bookings/{id}/pay")
    public ResponseEntity<Map<String, String>> payBookingOnline(@PathVariable(value = "id") int bookingId, @RequestBody Map<String, String> request) {
        String redirectUrl = request.get("redirectUrl");
        String paymentUrl = this.paymentService.createPaymentLink(bookingId, redirectUrl);
        Map<String, String> response = new HashMap<>();
        response.put("paymentUrl", paymentUrl);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/momo/ipn")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void handleMomoPaymentIpn(@RequestBody Map<String, String> ipnRequest) {
        this.paymentService.handlePaymentResult(ipnRequest, "MOMO");
    }
}
