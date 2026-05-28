/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import com.hp.dto.review.ReviewCreateDTO;
import com.hp.dto.review.ReviewViewDTO;
import com.hp.pojo.Booking;
import com.hp.pojo.Review;
import com.hp.repositories.BookingRepository;
import com.hp.repositories.ReviewRepository;
import com.hp.services.ReviewService;

import jakarta.transaction.Transactional;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Joon
 */
@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public List<ReviewViewDTO> getReviewsByServiceId(int serviceId, String page) {
        int pageNumber = 1;
        try {
            pageNumber = Integer.parseInt(page);
        } catch (NumberFormatException e) {
            pageNumber = 1;
        }

        List<Review> reviews = this.reviewRepository.getReviewsByServiceId(serviceId, pageNumber);
        return reviews.stream().map(this::toReviewViewDTO).toList();
    }

    @Override
    public void addReview(ReviewCreateDTO review, int bookingId) {
        Booking booking = this.bookingRepository.getBookingById(bookingId);
        if (booking == null) {
            throw new IllegalArgumentException("Booking không tồn tại!");
        }

        if (!"COMPLETED".equals(booking.getStatusId().getName())) {
            throw new IllegalArgumentException("Chỉ có thể đánh giá sau khi dịch vụ đã hoàn thành!");
        }

        if (booking.getReview() != null) {
            throw new IllegalArgumentException("Bạn chỉ có thể đánh giá một lần!");
        }

        Review newReview = new Review();
        newReview.setBookingId(new Booking(bookingId));
        newReview.setRating(review.rating());
        newReview.setComment(review.comment());
        newReview.setReviewDate(new Date());
        this.reviewRepository.addReview(newReview);
    }

    private ReviewViewDTO toReviewViewDTO(Review review) {
        return new ReviewViewDTO(
                review.getId(),
                review.getRating(),
                review.getComment(),
                review.getReviewDate());
    }
}
