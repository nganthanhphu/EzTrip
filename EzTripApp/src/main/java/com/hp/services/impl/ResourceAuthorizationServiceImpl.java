/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import com.hp.pojo.Booking;
import com.hp.pojo.Image;
import com.hp.repositories.BaseServiceRepository;
import com.hp.repositories.BookingRepository;
import com.hp.repositories.ImageRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hp.services.ResourceAuthorizationService;

/**
 *
 * @author Joon
 */
@Service
@Transactional
public class ResourceAuthorizationServiceImpl implements ResourceAuthorizationService {

    @Autowired
    private BaseServiceRepository baseServiceRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ImageRepository imageRepository;

    @PostAuthorize("returnObject != null and (returnObject.getProviderId().getId() == principal.providerId or hasRole('ADMIN'))")
    @Override
    public com.hp.pojo.Service getServiceForUpdate(Integer id) {
        return this.baseServiceRepository.getServiceById(id);
    }

    @PostAuthorize("returnObject != null and (hasRole('ADMIN') or returnObject.getCustomerId().getId() == principal.customerId or returnObject.getServiceId().getProviderId().getId() == principal.providerId)")
    @Override
    public Booking getBookingForUpdate(int bookingId) {
        return this.bookingRepository.getBookingById(bookingId);
    }

    @PostAuthorize("returnObject != null and (hasRole('ADMIN') or returnObject.getServiceId().getProviderId().getId() == principal.providerId)")
    @Override
    public Image getImageForUpdate(Integer id) {
        return this.imageRepository.getImageById(id);
    }

    @PostAuthorize("returnObject != null and returnObject.getCustomerId().getId() == principal.customerId")
    @Override
    public Booking getBookingForPayment(int bookingId) {
        return this.bookingRepository.getBookingById(bookingId);
    }

    @PostAuthorize("returnObject != null and returnObject.getCustomerId().getId() == principal.customerId")
    @Override
    public Booking getBookingForReview(int bookingId) {
        return this.bookingRepository.getBookingById(bookingId);
    }

}
