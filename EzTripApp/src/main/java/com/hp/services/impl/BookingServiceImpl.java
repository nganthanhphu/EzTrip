/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import com.hp.dto.booking.BookingCreateDTO;
import com.hp.dto.booking.BookingDetailDTO;
import com.hp.dto.review.ReviewDetailDTO;
import com.hp.pojo.BaseUser;
import com.hp.pojo.Booking;
import com.hp.pojo.BookingStatus;
import com.hp.pojo.PaymentMethod;
import com.hp.repositories.BaseServiceRepository;
import com.hp.repositories.BookingRepository;
import com.hp.repositories.UserRepository;
import com.hp.services.BookingService;
import com.hp.utils.UserUtils;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Joon
 */
@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BaseServiceRepository serviceRepository;

    @Override
    public void addBooking(BookingCreateDTO bk) {
        Object[] service = this.serviceRepository.getServiceById(bk.getServiceId());
        if (service == null) {
            throw new IllegalArgumentException("Dịch vụ không tồn tại!");
        }

        if (!(boolean) service[1]) {
            throw new IllegalArgumentException("Dịch vụ không khả dụng!");
        }

        int quantity = bk.getQuantity();

        if (quantity > (int) service[3]) {
            throw new IllegalArgumentException("Số lượng vượt quá số lượng có sẵn!");
        }
        
        Date bookingDay;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
            bookingDay = sdf.parse(bk.getBookingDay());
        } catch (Exception e) {
            throw new IllegalArgumentException("Ngày bắt đầu dịch vụ không hợp lệ!");
        }

        BaseUser currentUser = this.userRepository.getUserByPhone(UserUtils.getCurrentUserDetails().getUsername());

        Booking booking = new Booking();
        booking.setCreatedDate(new Date());
        booking.setBookingDay(bookingDay);
        booking.setQuantity(quantity);
        booking.setTotalAmount(((Number) service[2]).intValue() * quantity);
        booking.setNote(bk.getNote());
        booking.setStatusId(new BookingStatus(1));
        booking.setCustomerId(currentUser.getCustomerProfile());
        booking.setPaymentMethodId(new PaymentMethod(bk.getPaymentMethodId()));
        booking.setServiceId(new com.hp.pojo.Service(bk.getServiceId()));

        this.bookingRepository.addOrUpdateBooking(booking);
    }

    public BookingDetailDTO toBookingDetailDTO(Booking booking) {
        if (booking == null) {
            return null;
        }

        BookingDetailDTO bookingDTO = new BookingDetailDTO();
        bookingDTO.setId(booking.getId());
        bookingDTO.setServiceName(booking.getServiceId().getName());
        bookingDTO.setBookingDate(booking.getBookingDate());
        bookingDTO.setStatus(booking.getStatusId().getName());
        bookingDTO.setCustomerName(booking.getCustomerId().getUserId().getFullname());
        bookingDTO.setCustomerPhone(booking.getCustomerId().getUserId().getPhoneNumber());
        bookingDTO.setCustomerAvatar(booking.getCustomerId().getUserId().getAvatar());
        bookingDTO.setPaymentMethod(booking.getPaymentMethodId().getName());

        if (booking.getReview() != null) {
            ReviewDetailDTO reviewDTO = new ReviewDetailDTO();
            reviewDTO.setId(booking.getReview().getId());
            reviewDTO.setRating(booking.getReview().getRating());
            reviewDTO.setComment(booking.getReview().getComment());
            reviewDTO.setReviewDate(booking.getReview().getReviewDate());
            bookingDTO.setReview(reviewDTO);
        }

        return bookingDTO;
    }

}
