/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories;

import com.hp.pojo.Review;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Joon
 */
public interface ReviewRepository {
    List<Review> getReviewsByServiceId(int serviceId, Map<String, String> params);
    void addReview(Review review);
}
