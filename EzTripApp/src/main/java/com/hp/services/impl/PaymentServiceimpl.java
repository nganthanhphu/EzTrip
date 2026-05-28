/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hp.pojo.Booking;
import com.hp.repositories.BookingRepository;
import com.hp.services.PaymentService;
import com.hp.services.handler.payment.PaymentHandler;

/**
 *
 * @author Joon
 */

@Service
@Transactional
public class PaymentServiceimpl implements PaymentService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private Map<String, PaymentHandler> paymentHandlers;

    @Override
    public String createPaymentLink(int bookingId, String redirectUrl) {
        Booking booking = this.bookingRepository.getBookingById(bookingId);
        PaymentHandler handler = this.getPaymentHandler(booking);

        return handler.createPaymentLink(booking, redirectUrl);
    }


    @Override
    public void handlePaymentResult(int bookingId, Map<String, String> ipnRequest) {
        Booking booking = this.bookingRepository.getBookingById(bookingId);
        if (booking == null) {
            throw new IllegalArgumentException("Booking không tồn tại!");
        }

        PaymentHandler handler = this.paymentHandlers.get(booking.getPaymentMethodId().getName());

        handler.handlePaymentResult(booking, ipnRequest);

        this.bookingRepository.addOrUpdateBooking(booking);

    }

    private PaymentHandler getPaymentHandler(Booking booking) {

        if (booking == null) {
            throw new IllegalArgumentException("Booking không tồn tại!");
        }

        if (!booking.getStatusId().getName().equals("PENDING"))
            throw new IllegalStateException("Booking này đã thanh toán, hoàn thành hoặc bị hủy!");

        PaymentHandler handler = this.paymentHandlers.get(booking.getPaymentMethodId().getName());
        if (handler == null)
            throw new IllegalStateException("Phương thức thanh toán không được hỗ trợ!");

        return handler;

    }

}
