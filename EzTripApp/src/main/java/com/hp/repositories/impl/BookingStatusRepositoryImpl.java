/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.hp.pojo.BookingStatus;
import com.hp.repositories.BookingStatusRepository;


/**
 *
 * @author Joon
 */
@Repository
@Transactional
public class BookingStatusRepositoryImpl implements BookingStatusRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public BookingStatus getBookingStatusByName(String name) {
        Session s = this.factory.getObject().getCurrentSession();
        Query<BookingStatus> q = s.createNamedQuery("BookingStatus.findByName", BookingStatus.class);
        q.setParameter("name", name);
        return q.uniqueResult();
    }

    @Override
    public List<BookingStatus> getBookingStatuses() {
        Session s = this.factory.getObject().getCurrentSession();
        Query<BookingStatus> q = s.createQuery("SELECT bs FROM BookingStatus bs ORDER BY bs.id", BookingStatus.class);
        return q.getResultList();
    }

}
