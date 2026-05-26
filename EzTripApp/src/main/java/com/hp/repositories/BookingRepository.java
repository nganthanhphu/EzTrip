/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories;

import com.hp.pojo.Booking;

/**
 *
 * @author Joon
 */
public interface BookingRepository {
    void addOrUpdateBooking(Booking booking);
    Booking getBookingById(int id);
}
