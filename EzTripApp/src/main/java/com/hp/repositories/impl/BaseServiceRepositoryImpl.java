/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories.impl;

import com.hp.pojo.BaseUser;
import com.hp.pojo.Booking;
import com.hp.pojo.BookingStatus;
import com.hp.pojo.ProviderProfile;
import com.hp.pojo.Service;
import com.hp.repositories.BaseServiceRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Root;

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
public class BaseServiceRepositoryImpl implements BaseServiceRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Object[] getServiceForBookingValidation(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Object[]> q = b.createQuery(Object[].class);
        Root<Service> root = q.from(Service.class);
        Join<Service, Booking> booking = root.join("bookingSet", JoinType.LEFT);
        Join<Service, ProviderProfile> providerProfile = root.join("providerId", JoinType.INNER);
        Join<ProviderProfile, BaseUser> providerUser = providerProfile.join("userId", JoinType.INNER);
        Join<Booking, BookingStatus> bookingStatus = booking.join("statusId", JoinType.LEFT);

        Expression<Integer> confirmedCount = b.sum(
                b.<Integer>selectCase()
                        .when(
                                b.or(b.equal(bookingStatus.get("name"), "CONFIRMED"),
                                        b.equal(bookingStatus.get("name"), "PENDING")),
                                booking.get("quantity"))
                        .otherwise(0));

        Expression<Integer> remainingQuantity = b.diff(
                root.get("quantity"),
                b.coalesce(confirmedCount, 0));

        q.multiselect(root.get("id"), root.get("isActive"), root.get("price").as(Integer.class), remainingQuantity);
        q.where(b.and(b.equal(root.get("id"), id), b.isTrue(providerUser.get("isActive"))));
        q.groupBy(root.get("id"));

        Query<Object[]> query = s.createQuery(q);

        return query.uniqueResult();
    }

    @Override
    public void addOrUpdateService(Service svc) {
        Session s = this.factory.getObject().getCurrentSession();
        if (svc.getId() != null)
            s.merge(svc);
        else
            s.persist(svc);
    }

    @Override
    public Service getServiceById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        Query<Service> q = s.createQuery("""
                SELECT s
                FROM Service s
                LEFT JOIN FETCH s.imageSet
                LEFT JOIN FETCH s.typeOfServiceId
                LEFT JOIN FETCH s.providerId
                LEFT JOIN FETCH s.serviceAccommodation
                LEFT JOIN FETCH s.serviceTourism
                LEFT JOIN FETCH s.serviceTransportation
                WHERE s.id = :id
                """, Service.class);
        q.setParameter("id", id);
        return q.uniqueResult();
    }

}
