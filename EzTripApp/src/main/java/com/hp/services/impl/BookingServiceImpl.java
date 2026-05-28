/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import com.hp.dto.booking.BookingCreateDTO;
import com.hp.dto.booking.BookingUpdateDTO;
import com.hp.dto.booking.BookingViewDTO;
import com.hp.dto.review.ReviewViewDTO;
import com.hp.pojo.BaseUser;
import com.hp.pojo.Booking;
import com.hp.pojo.BookingStatus;
import com.hp.pojo.PaymentMethod;
import com.hp.pojo.Review;
import com.hp.repositories.BaseServiceRepository;
import com.hp.repositories.BookingRepository;
import com.hp.repositories.BookingStatusRepository;
import com.hp.repositories.UserRepository;
import com.hp.services.BookingService;
import com.hp.utils.UserUtils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

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

    @Autowired
    private BookingStatusRepository bookingStatusRepository;

    @Override
    public void addBooking(BookingCreateDTO bk) {
        Object[] service = this.serviceRepository.getServiceForBookingValidation(bk.serviceId());
        if (service == null) {
            throw new IllegalArgumentException("Dịch vụ không tồn tại!");
        }

        if (!(boolean) service[1]) {
            throw new IllegalArgumentException("Dịch vụ không khả dụng!");
        }

        int quantity = bk.quantity();

        if (quantity > (int) service[3]) {
            throw new IllegalArgumentException("Số lượng vượt quá số lượng có sẵn!");
        }

        Date bookingDay;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
            bookingDay = sdf.parse(bk.bookingDay());
        } catch (Exception e) {
            throw new IllegalArgumentException("Ngày bắt đầu dịch vụ không hợp lệ!");
        }

        BaseUser currentUser = this.userRepository.getUserByPhone(UserUtils.getCurrentUserDetails().getUsername());

        Booking booking = new Booking();
        booking.setCreatedDate(new Date());
        booking.setBookingDay(bookingDay);
        booking.setQuantity(quantity);
        booking.setTotalAmount(((Number) service[2]).intValue() * quantity);
        booking.setNote(bk.note());
        booking.setStatusId(new BookingStatus(1));
        booking.setCustomerId(currentUser.getCustomerProfile());
        booking.setPaymentMethodId(new PaymentMethod(bk.paymentMethodId()));
        booking.setServiceId(new com.hp.pojo.Service(bk.serviceId()));

        this.bookingRepository.addOrUpdateBooking(booking);
    }

    @Override
    public List<BookingViewDTO> getBookings(Map<String, String> params) {
        BaseUser currentUser = this.userRepository.getUserByPhone(UserUtils.getCurrentUserDetails().getUsername());

        int customerId = 0, providerId = 0;

        if (currentUser.getRoleId().getName().equals("CUSTOMER")) {
            customerId = currentUser.getCustomerProfile().getId();
        } else if (currentUser.getRoleId().getName().equals("PROVIDER")) {
            providerId = currentUser.getProviderProfile().getId();
        }

        return this.bookingRepository.getBookings(params, customerId, providerId).stream()
                .map(this::toBookingViewDTO)
                .toList();
    }

    private BookingViewDTO toBookingViewDTO(Booking booking) {
        if (booking == null) {
            return null;
        }

        Review review = booking.getReview();
        ReviewViewDTO reviewDTO = null;

        if (review != null) {
            reviewDTO = new ReviewViewDTO(
                    review.getId(),
                    review.getRating(),
                    review.getComment(),
                    review.getReviewDate());
        }

        return new BookingViewDTO(
                booking.getId(),
                booking.getServiceId().getName(),
                booking.getServiceId().getTypeOfServiceId().getId(),
                booking.getServiceId().getImageSet().stream().findFirst().orElse(null).getUrl(),
                booking.getCreatedDate(),
                booking.getBookingDay(),
                booking.getQuantity(),
                booking.getTotalAmount(),
                booking.getNote(),
                booking.getStatusId().getName(),
                booking.getCustomerId().getUserId().getFullname(),
                booking.getCustomerId().getUserId().getPhoneNumber(),
                booking.getCustomerId().getUserId().getAvatar(),
                booking.getPaymentMethodId().getName(),
                reviewDTO);
    }

    @Override
    public void updateBooking(int bookingId, BookingUpdateDTO bk) {
        Booking booking = this.bookingRepository.getBookingById(bookingId);
        if (booking == null) {
            throw new IllegalArgumentException("Booking không tồn tại!");
        }

        String statusName = booking.getStatusId().getName();
        if (statusName.equals("COMPLETED") || statusName.equals("CANCELLED")) {
            throw new IllegalStateException("Không thể cập nhật booking đã hoàn thành hoặc đã hủy!");
        }

        String newStatusString = bk.status();
        if (statusName.equals("PENDING")) {
            if (!newStatusString.equals("CONFIRMED") && !newStatusString.equals("CANCELLED")) {
                throw new IllegalArgumentException("Trạng thái mới không hợp lệ!");
            }
        } else if (statusName.equals("CONFIRMED")) {
            if (!newStatusString.equals("COMPLETED")) {
                throw new IllegalArgumentException("Trạng thái mới không hợp lệ!");
            }
        }

        BookingStatus newStatus = this.bookingStatusRepository.getBookingStatusByName(newStatusString);
        booking.setStatusId(newStatus);
        this.bookingRepository.addOrUpdateBooking(booking);

    }

}
