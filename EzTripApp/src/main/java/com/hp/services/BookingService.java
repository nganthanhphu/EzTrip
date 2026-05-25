/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services;

import com.hp.dto.booking.BookingCreateDTO;
import com.hp.dto.booking.BookingDetailDTO;

/**
 *
 * @author Joon
 */
public interface BookingService {
    BookingDetailDTO addBooking(BookingCreateDTO bk);
}
