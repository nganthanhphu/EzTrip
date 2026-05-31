/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories.impl;

import com.hp.pojo.Booking;
import com.hp.repositories.BookingRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Joon
 */
@Repository
@Transactional
@PropertySource("classpath:application.properties")
public class BookingRepositoryImpl implements BookingRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Autowired
    private Environment env;

    @Override
    public Booking getBookingById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        Query<Booking> query = s.createQuery("""
                SELECT b
                FROM Booking b
                LEFT JOIN FETCH b.serviceId
                LEFT JOIN FETCH b.statusId
                LEFT JOIN FETCH b.paymentMethodId
                LEFT JOIN FETCH b.review
                LEFT JOIN FETCH b.customerId c
                LEFT JOIN FETCH c.userId
                WHERE b.id = :id
                """, Booking.class);
        query.setParameter("id", id);
        return query.uniqueResult();
    }

    @Override
    public void addOrUpdateBooking(Booking booking) {
        Session s = this.factory.getObject().getCurrentSession();
        if (booking.getId() != null) {
            s.merge(booking);
        } else {
            s.persist(booking);
        }
    }

    @Override
    public List<Booking> getBookings(Map<String, String> params, int customerId, int providerId) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Booking> q = b.createQuery(Booking.class);
        Root<Booking> root = q.from(Booking.class);

        root.fetch("serviceId", JoinType.LEFT).fetch("typeOfServiceId", JoinType.LEFT);
        root.fetch("serviceId", JoinType.LEFT).fetch("imageSet", JoinType.LEFT);
        root.fetch("serviceId", JoinType.LEFT).fetch("providerId", JoinType.LEFT).fetch("userId", JoinType.LEFT);
        root.fetch("statusId", JoinType.LEFT);
        root.fetch("paymentMethodId", JoinType.LEFT);
        root.fetch("review", JoinType.LEFT);
        root.fetch("customerId", JoinType.LEFT).fetch("userId", JoinType.LEFT);
        q.select(root);

        List<Predicate> predicates = new ArrayList<>();

        if (customerId > 0) {
            predicates.add(b.equal(root.get("customerId").get("id"), customerId));
        } else if (providerId > 0) {
            predicates.add(b.equal(root.get("serviceId").get("providerId").get("id"), providerId));
        }

        if (params != null) {
            String status = params.get("status");
            if (status != null && !status.isEmpty()) {
                predicates.add(b.equal(root.get("statusId").get("name"), status));
            }

            String serviceName = params.get("serviceName");
            if (serviceName != null && !serviceName.isEmpty()) {
                predicates.add(b.like(root.get("serviceId").get("name"), String.format("%%%s%%", serviceName)));
            }

            String typeOfService = params.get("typeOfService");
            if (typeOfService != null && !typeOfService.isEmpty()) {
                try {
                    predicates.add(b.equal(root.get("serviceId").get("typeOfServiceId").get("id"),
                            Integer.parseInt(typeOfService)));
                } catch (NumberFormatException e) {

                }
            }

            String customerName = params.get("customerName");
            if (customerName != null && !customerName.isEmpty()) {
                predicates.add(b.like(root.get("customerId").get("userId").get("fullname"),
                        String.format("%%%s%%", customerName)));
            }

        }

        q.where(predicates.toArray(Predicate[]::new));
        q.orderBy(b.desc(root.get("createdDate")));

        Query<Booking> query = s.createQuery(q);

        int pageSize = this.env.getProperty("PAGE_SIZE", Integer.class);
        int page = 1;
        if (params != null)
            try {
                page = Integer.parseInt(params.getOrDefault("page", "1"));
            } catch (NumberFormatException e) {
                page = 1;
            }

        int start = (page - 1) * pageSize;
        query.setFirstResult(start);
        query.setMaxResults(pageSize);

        return query.getResultList();
    }

}
