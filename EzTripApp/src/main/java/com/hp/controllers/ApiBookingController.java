/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.hp.dto.booking.BookingCreateDTO;
import com.hp.dto.booking.BookingDetailDTO;
import com.hp.services.BookingService;

/**
 *
 * @author Joon
 */
@Controller
@RequestMapping("/api")
public class ApiBookingController {

    @Autowired
    private BookingService bookingService;
    
    @PostMapping("/secure/booking")
    public ResponseEntity<BookingDetailDTO> createBooking(@RequestBody BookingCreateDTO booking) {
        BookingDetailDTO addedBooking = bookingService.addBooking(booking);
        return new ResponseEntity<>(addedBooking, HttpStatus.CREATED);
    }
    
}
