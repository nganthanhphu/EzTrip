/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services;

import com.hp.pojo.Booking;
import com.hp.pojo.Image;
import com.hp.pojo.Service;

/**
 *
 * @author Joon
 */
public interface ResourceAuthorizationService {
    Service getServiceForUpdate(Integer id);

    Booking getBookingForUpdate(int bookingId);

    Image getImageForUpdate(Integer id);

    Booking getBookingForPayment(int bookingId);

    Booking getBookingForReview(int bookingId);
}
