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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.fasterxml.jackson.core.JsonProcessingException;
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
    public ResponseEntity<Map<String, String>> payBookingOnline(@PathVariable(value = "id") int bookingId,
            @RequestBody Map<String, String> request) throws JsonProcessingException {
        String redirectUrl = request.get("redirectUrl");
        String paymentUrl = this.paymentService.createPaymentLink(bookingId, redirectUrl);
        Map<String, String> response = new HashMap<>();
        response.put("paymentUrl", paymentUrl);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/callback/momo")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void handleMomoPaymentIpn(@RequestBody Map<String, String> ipnRequest) {
        this.paymentService.handlePaymentResult(ipnRequest, "MOMO");
    }

    @PostMapping("/callback/zalopay")
    public ResponseEntity<Map<String, Object>> handleZaloPayPaymentCallback(
            @RequestBody Map<String, String> callbackRequest) {
        try {
            this.paymentService.handlePaymentResult(callbackRequest, "ZALOPAY");
            return new ResponseEntity<>(Map.of(
                    "return_code", 1,
                    "return_message", "Xác nhận thanh toán thành công!"), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of(
                    "return_code", 0,
                    "return_message", e.getMessage()), HttpStatus.OK);
        }
    }

    @GetMapping("/callback/vnpay")
    public ResponseEntity<Map<String, Object>> handleVNPayPaymentCallback(
            @RequestParam Map<String, String> callbackRequest) {
        try {
            this.paymentService.handlePaymentResult(callbackRequest, "VNPAY");
            return new ResponseEntity<>(Map.of(
                    "RspCode", 00,
                    "Message", "Xác nhận thanh toán thành công!"), HttpStatus.OK);
        } catch (RuntimeException e) {
            String message = e.getMessage();
            String rspCode;
            String rspMessage;
            if (message.equals("Thanh toán không hợp lệ!")) {
                rspCode = "97";
                rspMessage = message;
            } else if (message.equals("Đơn hàng không hợp lệ!")) {
                rspCode = "01";
                rspMessage = message;
            } else {
                rspCode = "99";
                rspMessage = "Lỗi không xác định!";
            }

            return new ResponseEntity<>(Map.of(
                    "RspCode", rspCode,
                    "Message", rspMessage), HttpStatus.OK);
        }

    }
}
