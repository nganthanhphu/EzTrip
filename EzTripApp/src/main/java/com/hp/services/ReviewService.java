/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services;

import com.hp.dto.review.ReviewCreateDTO;
import com.hp.dto.review.ReviewViewDTO;
import java.util.List;

/**
 *
 * @author Joon
 */
public interface ReviewService {

    List<ReviewViewDTO> getReviewsByServiceId(int serviceId, String page);

    void addReview(ReviewCreateDTO review, int bookingId);
}
