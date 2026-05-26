/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.service;

import java.math.BigDecimal;

/**
 *
 * @author Joon
 */
public class BaseServiceListDTO {

    private Integer id;
    private String name;
    private BigDecimal price;
    private String image;
    private Integer quantity;
    private Integer remainingQuantity;
    private Double avgRating;
    private Long reviewCount;
    private Long bookingCount;
    private String companyName;

    public BaseServiceListDTO() {
    }

    public BaseServiceListDTO(Integer id, String name, BigDecimal price, String image, Integer quantity,
            Integer remainingQuantity, Double avgRating,
            Long reviewCount, Long bookingCount, String companyName) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.quantity = quantity;
        this.remainingQuantity = remainingQuantity;
        this.avgRating = avgRating;
        this.reviewCount = reviewCount;
        this.bookingCount = bookingCount;
        this.companyName = companyName;
    }

    /**
     * @return the id
     */
    public Integer getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the price
     */
    public BigDecimal getPrice() {
        return price;
    }

    /**
     * @param price the price to set
     */
    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    /**
     * @return the image
     */
    public String getImage() {
        return image;
    }

    /**
     * @param image the image to set
     */
    public void setImage(String image) {
        this.image = image;
    }

    /**
     * @return the avgRating
     */
    public Double getAvgRating() {
        return avgRating;
    }

    /**
     * @param avgRating the avgRating to set
     */
    public void setAvgRating(Double avgRating) {
        this.avgRating = avgRating;
    }

    /**
     * @return the reviewCount
     */
    public Long getReviewCount() {
        return reviewCount;
    }

    /**
     * @param reviewCount the reviewCount to set
     */
    public void setReviewCount(Long reviewCount) {
        this.reviewCount = reviewCount;
    }

    /**
     * @return the bookingCount
     */
    public Long getBookingCount() {
        return bookingCount;
    }

    /**
     * @param bookingCount the bookingCount to set
     */
    public void setBookingCount(Long bookingCount) {
        this.bookingCount = bookingCount;
    }

    /**
     * @return the quantity
     */
    public Integer getQuantity() {
        return quantity;
    }

    /**
     * @param quantity the quantity to set
     */
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    /**
     * @return the remainingQuantity
     */
    public Integer getRemainingQuantity() {
        return remainingQuantity;
    }

    /**
     * @param remainingQuantity the remainingQuantity to set
     */
    public void setRemainingQuantity(Integer remainingQuantity) {
        this.remainingQuantity = remainingQuantity;
    }

    /**
     * @return the companyName
     */
    public String getCompanyName() {
        return companyName;
    }

    /**
     * @param companyName the companyName to set
     */
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

}
