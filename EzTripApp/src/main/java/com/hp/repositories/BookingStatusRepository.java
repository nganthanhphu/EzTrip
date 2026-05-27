/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories;

import com.hp.pojo.BookingStatus;
import java.util.List;

/**
 *
 * @author Joon
 */
public interface BookingStatusRepository {

    BookingStatus getBookingStatusByName(String name);

    List<BookingStatus> getBookingStatuses();
}
