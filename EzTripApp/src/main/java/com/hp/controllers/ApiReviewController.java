/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.controllers;

import com.hp.dto.review.ReviewCreateDTO;
import com.hp.dto.review.ReviewViewDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.hp.services.ReviewService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 *
 * @author Joon
 */
@Controller
@RequestMapping("/api")
public class ApiReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping({"/accommodations/{serviceId}/reviews", "/tourisms/{serviceId}/reviews", "/transportations/{serviceId}/reviews"})
    public ResponseEntity<List<ReviewViewDTO>> getReviewsByService(@PathVariable(value = "serviceId") int serviceId, @RequestParam(name = "page", required = false) String page) {
        List<ReviewViewDTO> reviews = this.reviewService.getReviewsByServiceId(serviceId, page);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @PostMapping("/secure/bookings/{id}/reviews")
    @ResponseStatus(HttpStatus.CREATED)
    public void addReview(@RequestBody ReviewCreateDTO review, @PathVariable(value = "id") int id) {
        this.reviewService.addReview(review, id);
    }

    
}
