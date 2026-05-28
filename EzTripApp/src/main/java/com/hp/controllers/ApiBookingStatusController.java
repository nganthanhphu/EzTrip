/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.hp.pojo.BookingStatus;
import com.hp.services.BookingStatusService;

/**
 *
 * @author Joon
 */
@Controller
@RequestMapping("/api")
public class ApiBookingStatusController {

    @Autowired
    private BookingStatusService bookingStatusService;

    @GetMapping("/booking-statuses")
    public ResponseEntity<List<BookingStatus>> getBookingStatuses() {
        List<BookingStatus> bookingStatuses = this.bookingStatusService.getBookingStatuses();
        return new ResponseEntity<>(bookingStatuses, HttpStatus.OK);
    }
}