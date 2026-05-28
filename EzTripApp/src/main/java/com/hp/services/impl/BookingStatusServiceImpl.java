/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import com.hp.pojo.BookingStatus;
import com.hp.repositories.BookingStatusRepository;
import com.hp.services.BookingStatusService;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Joon
 */
@Service
@Transactional
public class BookingStatusServiceImpl implements BookingStatusService{
    
    @Autowired
    private BookingStatusRepository bookingStatusRepository;

    @Override
    public List<BookingStatus> getBookingStatuses() {
        return this.bookingStatusRepository.getBookingStatuses();
    }
    
}
