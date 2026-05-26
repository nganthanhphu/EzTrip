/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services;

import java.util.List;
import java.util.Map;

import com.hp.dto.booking.BookingCreateDTO;
import com.hp.dto.booking.BookingViewDTO;

/**
 *
 * @author Joon
 */
public interface BookingService {
    void addBooking(BookingCreateDTO bk);
    BookingViewDTO getBookingById(int id);
    List<BookingViewDTO> getBookings(Map<String, String> params);
}
