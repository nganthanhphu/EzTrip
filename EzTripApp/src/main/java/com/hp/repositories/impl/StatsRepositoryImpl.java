/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.hp.pojo.Booking;
import com.hp.pojo.ProviderProfile;
import com.hp.pojo.Service;
import com.hp.repositories.StatsRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

/**
 *
 * @author Joon
 */
@Repository
@Transactional
public class StatsRepositoryImpl implements StatsRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public int getServiceCount(int year, Integer providerId, Integer serviceId, Integer month, boolean isOnlyActive) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Long> q = b.createQuery(Long.class);
        Root<Service> service = q.from(Service.class);
        Join<Service, Booking> booking = service.join("bookingSet", JoinType.INNER);
        Join<Service, ProviderProfile> provider = service.join("providerId", JoinType.INNER);
        q.select(b.coalesce(b.countDistinct(service.get("id")), 0).as(Long.class));

        List<Predicate> predicates = new ArrayList<>();

        predicates.add(b.equal(b.function("YEAR", Integer.class, booking.get("createdDate")), year));

        if (providerId != null) {
            predicates.add(b.equal(provider.get("id"), providerId));
        }

        if (serviceId != null) {
            predicates.add(b.equal(service.get("id"), serviceId));
        }

        if (month != null) {
            predicates.add(b.equal(b.function("MONTH", Integer.class, booking.get("createdDate")), month));
        }

        if (isOnlyActive) {
            predicates.add(b.isTrue(service.get("isActive")));
        }

        q.where(predicates.toArray(Predicate[]::new));

        Query<Long> query = s.createQuery(q);
        return query.uniqueResult().intValue();
    }

    @Override
    public List<Object[]> getStats(String statsType, int year, Integer providerId, Integer serviceId, Integer month) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Object[]> q = b.createQuery(Object[].class);

        Root<Booking> booking = q.from(Booking.class);

        Expression<Integer> confirmedBookingCount = b.sum(
                b.<Integer>selectCase().when(b.equal(booking.get("statusId").get("name"), "CONFIRMED"), 1).otherwise(0))
                .as(Integer.class);

        Expression<Integer> completedBookingCount = b.sum(
                b.<Integer>selectCase().when(b.equal(booking.get("statusId").get("name"), "COMPLETED"), 1).otherwise(0))
                .as(Integer.class);

        Expression<Integer> cancelledBookingCount = b.sum(
                b.<Integer>selectCase().when(b.equal(booking.get("statusId").get("name"), "CANCELLED"), 1).otherwise(0))
                .as(Integer.class);

        Expression<Integer> revenue = b.sum(
                b.<Integer>selectCase().when(
                        b.or(
                                b.equal(booking.get("statusId").get("name"), "CONFIRMED"),
                                b.equal(booking.get("statusId").get("name"), "COMPLETED")),
                        booking.get("totalAmount")).otherwise(0))
                .as(Integer.class);

        Expression<Integer> date = b.function(statsType, Integer.class, booking.get("createdDate"));

        q.multiselect(
                date.as(Integer.class),
                b.coalesce(revenue, 0).as(Integer.class),
                b.coalesce(confirmedBookingCount, 0).as(Integer.class),
                b.coalesce(completedBookingCount, 0).as(Integer.class),
                b.coalesce(cancelledBookingCount, 0).as(Integer.class)

        );

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(b.equal(b.function("YEAR", Integer.class, booking.get("createdDate")), year));

        if (month != null) {
            predicates.add(b.equal(b.function("MONTH", Integer.class, booking.get("createdDate")), month));
        }

        if (providerId != null) {
            Join<Booking, Service> service = booking.join("serviceId", JoinType.INNER);
            Join<Service, ProviderProfile> provider = service.join("providerId", JoinType.INNER);
            predicates.add(b.equal(provider.get("id"), providerId));
        }

        if (serviceId != null) {
            Join<Booking, Service> service = booking.join("serviceId", JoinType.INNER);
            predicates.add(b.equal(service.get("id"), serviceId));
        }

        q.where(predicates.toArray(Predicate[]::new));
        q.groupBy(date);
        q.orderBy(b.asc(date));

        Query<Object[]> query = s.createQuery(q);
        return query.getResultList();
    }
}
