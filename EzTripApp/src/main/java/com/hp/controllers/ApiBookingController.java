/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.hp.dto.booking.BookingCreateDTO;
import com.hp.dto.booking.BookingViewDTO;
import com.hp.services.BookingService;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 *
 * @author Joon
 */
@Controller
@RequestMapping("/api")
public class ApiBookingController {

    @Autowired
    private BookingService bookingService;
    
    @PostMapping("/secure/bookings")
    @ResponseStatus(HttpStatus.CREATED)
    public void createBooking(@RequestBody BookingCreateDTO booking) {
        this.bookingService.addBooking(booking);
    }

    @GetMapping("/secure/bookings")
    public ResponseEntity<List<BookingViewDTO>> getBooking(@RequestParam Map<String, String> params) {
        List<BookingViewDTO> bookings = this.bookingService.getBookings(params);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    @GetMapping("/secure/bookings/{id}")
    public ResponseEntity<BookingViewDTO> getBookingById(@PathVariable(value = "id") int id) {
        BookingViewDTO booking = this.bookingService.getBookingById(id);
        if (booking != null) {
            return new ResponseEntity<>(booking, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
}
