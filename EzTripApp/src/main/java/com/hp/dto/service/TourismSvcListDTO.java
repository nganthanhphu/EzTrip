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
public class TourismSvcListDTO {
    private BaseServiceListDTO baseInfo;
    private int tourDuration;
    private String location;

    public TourismSvcListDTO() {
    }

    public TourismSvcListDTO(Integer id, String name, BigDecimal price, String image, Integer quantity,
            Integer remainingQuantity, Double avgRating, Long reviewCount, Long bookingCount, String companyName,
            int tourDuration,
            String location) {
        this.baseInfo = new BaseServiceListDTO(id, name, price, image, quantity, remainingQuantity, avgRating,
                reviewCount, bookingCount, companyName);
        this.tourDuration = tourDuration;
        this.location = location;
    }

    /**
     * @return the baseInfo
     */
    public BaseServiceListDTO getBaseInfo() {
        return baseInfo;
    }

    /**
     * @param baseInfo the baseInfo to set
     */
    public void setBaseInfo(BaseServiceListDTO baseInfo) {
        this.baseInfo = baseInfo;
    }

    /**
     * @return the location
     */
    public String getLocation() {
        return location;
    }

    /**
     * @param location the location to set
     */
    public void setLocation(String location) {
        this.location = location;
    }

    /**
     * @return the tourDuration
     */
    public int getTourDuration() {
        return tourDuration;
    }

    /**
     * @param tourDuration the tourDuration to set
     */
    public void setTourDuration(int tourDuration) {
        this.tourDuration = tourDuration;
    }
}
