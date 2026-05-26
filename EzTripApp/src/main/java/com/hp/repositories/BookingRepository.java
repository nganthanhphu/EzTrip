/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories;

import java.util.List;
import java.util.Map;

import com.hp.dto.booking.BookingViewDTO;
import com.hp.pojo.Booking;

/**
 *
 * @author Joon
 */
public interface BookingRepository {
    void addOrUpdateBooking(Booking booking);
    BookingViewDTO getBookingById(int id);
    List<BookingViewDTO> getBookings(Map<String, String> params, int customerId, int providerId);
}
