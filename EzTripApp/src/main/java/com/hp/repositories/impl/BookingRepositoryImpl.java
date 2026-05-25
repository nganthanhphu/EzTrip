/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories.impl;

import com.hp.pojo.Booking;
import com.hp.repositories.BookingRepository;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Joon
 */
@Repository
@Transactional
public class BookingRepositoryImpl implements BookingRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Booking getBookingById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        Query<Booking> q = s.createNamedQuery("Booking.findById", Booking.class);
        q.setParameter("id", id);
        return q.getSingleResult();
    }

    @Override
    public Booking addOrUpdateBooking(Booking booking) {
        Session s = this.factory.getObject().getCurrentSession();
        if (booking.getId() != null) {
            s.merge(booking);
        } else {
            s.persist(booking);
        }
        s.flush();
        int id = booking.getId();
        s.detach(booking);
        return this.getBookingById(id);
    }

}
