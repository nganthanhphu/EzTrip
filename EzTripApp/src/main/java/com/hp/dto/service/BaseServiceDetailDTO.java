/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 *
 * @author Joon
 */
public class BaseServiceDetailDTO {

    private Integer id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private Integer remainingQuantity;
    private Set<String> images;
    private Double avgRating;
    private Long reviewCount;
    private Long bookingCount;
    @JsonIgnore
    private List<MultipartFile> imgFiles;
    private String companyName;
    private String companyAddress;
    private String companyPhone;
    private String companyEmail;

    public BaseServiceDetailDTO() {
    }

    public BaseServiceDetailDTO(Integer id, String name, String description, BigDecimal price, Integer quantity,
            Integer remainingQuantity, Double avgRating, Long reviewCount, Long bookingCount, String companyName,
            String companyAddress,
            String companyPhone, String companyEmail) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.remainingQuantity = remainingQuantity;
        this.avgRating = avgRating;
        this.reviewCount = reviewCount;
        this.bookingCount = bookingCount;
        this.companyName = companyName;
        this.companyAddress = companyAddress;
        this.companyPhone = companyPhone;
        this.companyEmail = companyEmail;
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
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * @param description the description to set
     */
    public void setDescription(String description) {
        this.description = description;
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
     * @return the images
     */
    public Set<String> getImages() {
        return images;
    }

    /**
     * @param images the images to set
     */
    public void setImages(Set<String> images) {
        this.images = images;
    }

    /**
     * @return the imgFiles
     */
    public List<MultipartFile> getImgFiles() {
        return imgFiles;
    }

    /**
     * @param imgFiles the imgFiles to set
     */
    public void setImgFiles(List<MultipartFile> imgFiles) {
        this.imgFiles = imgFiles;
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

    /**
     * @return the companyAddress
     */
    public String getCompanyAddress() {
        return companyAddress;
    }

    /**
     * @param companyAddress the companyAddress to set
     */
    public void setCompanyAddress(String companyAddress) {
        this.companyAddress = companyAddress;
    }

    /**
     * @return the companyPhone
     */
    public String getCompanyPhone() {
        return companyPhone;
    }

    /**
     * @param companyPhone the companyPhone to set
     */
    public void setCompanyPhone(String companyPhone) {
        this.companyPhone = companyPhone;
    }

    /**
     * @return the companyEmail
     */
    public String getCompanyEmail() {
        return companyEmail;
    }

    /**
     * @param companyEmail the companyEmail to set
     */
    public void setCompanyEmail(String companyEmail) {
        this.companyEmail = companyEmail;
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
}
