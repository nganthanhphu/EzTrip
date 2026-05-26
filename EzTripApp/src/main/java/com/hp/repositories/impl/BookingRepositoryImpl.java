/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories.impl;

import com.hp.dto.booking.BookingViewDTO;
import com.hp.pojo.BaseUser;
import com.hp.pojo.Booking;
import com.hp.pojo.BookingStatus;
import com.hp.pojo.CustomerProfile;
import com.hp.pojo.PaymentMethod;
import com.hp.pojo.Review;
import com.hp.pojo.Service;
import com.hp.repositories.BookingRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
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
    public BookingViewDTO getBookingById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<BookingViewDTO> q = b.createQuery(BookingViewDTO.class);
        Root<Booking> root = q.from(Booking.class);

        Join<Booking, Service> service = root.join("serviceId", JoinType.LEFT);
        Join<Booking, BookingStatus> status = root.join("statusId", JoinType.LEFT);
        Join<Booking, PaymentMethod> payment = root.join("paymentMethodId", JoinType.LEFT);
        Join<Booking, Review> review = root.join("review", JoinType.LEFT);
        Join<Booking, CustomerProfile> customer = root.join("customerId", JoinType.LEFT);
        Join<CustomerProfile, BaseUser> user = customer.join("userId", JoinType.LEFT);

        q.select(b.construct(BookingViewDTO.class,
                root.get("id"),
                service.get("name"),
                root.get("createdDate"),
                root.get("bookingDay"),
                root.get("quantity"),
                root.get("totalAmount"),
                root.get("note"),
                status.get("name"),
                user.get("fullname"),
                user.get("phoneNumber"),
                user.get("avatar"),
                payment.get("name"),
                review.get("id"),
                review.get("rating"),
                review.get("comment"),
                review.get("reviewDate")));

        q.where(b.equal(root.get("id"), id));

        Query<BookingViewDTO> query = s.createQuery(q);
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
    public List<BookingViewDTO> getBookings(Map<String, String> params, int customerId, int providerId) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<BookingViewDTO> q = b.createQuery(BookingViewDTO.class);
        Root<Booking> root = q.from(Booking.class);

        Join<Booking, Service> service = root.join("serviceId", JoinType.LEFT);
        Join<Booking, BookingStatus> bookingStatus = root.join("statusId", JoinType.LEFT);
        Join<Booking, PaymentMethod> payment = root.join("paymentMethodId", JoinType.LEFT);
        Join<Booking, Review> review = root.join("review", JoinType.LEFT);
        Join<Booking, CustomerProfile> customer = root.join("customerId", JoinType.LEFT);
        Join<CustomerProfile, BaseUser> user = customer.join("userId", JoinType.LEFT);

        q.select(b.construct(BookingViewDTO.class,
                root.get("id"),
                service.get("name"),
                root.get("createdDate"),
                root.get("bookingDay"),
                root.get("quantity"),
                root.get("totalAmount"),
                root.get("note"),
                bookingStatus.get("name"),
                user.get("fullname"),
                user.get("phoneNumber"),
                user.get("avatar"),
                payment.get("name"),
                review.get("id"),
                review.get("rating"),
                review.get("comment"),
                review.get("reviewDate")));

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
        }

        q.where(predicates.toArray(Predicate[]::new));

        Query<BookingViewDTO> query = s.createQuery(q);

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
