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
public class TourismSvcDetailDTO {

    private BaseServiceDetailDTO baseInfo;
    private Integer id;
    private int tourDuration;
    private String location;

    public TourismSvcDetailDTO() {
    }

    public TourismSvcDetailDTO(BaseServiceDetailDTO baseInfo, Integer id, int tourDuration, String location) {
        this.baseInfo = baseInfo;
        this.id = id;
        this.tourDuration = tourDuration;
        this.location = location;
    }

    public TourismSvcDetailDTO(Integer baseId, String name, String description, BigDecimal price,
            Integer quantity, Integer remainingQuantity, Double avgRating, Long reviewCount, Long bookingCount,
            String companyName, String companyAddress, String companyPhone, String companyEmail, Integer id,
            int tourDuration, String location) {
        this.baseInfo = new BaseServiceDetailDTO(baseId, name, description, price, quantity, remainingQuantity,
                avgRating, reviewCount, bookingCount, companyName, companyAddress, companyPhone, companyEmail);
        this.id = id;
        this.tourDuration = tourDuration;
        this.location = location;
    }

    /**
     * @return the baseInfo
     */
    public BaseServiceDetailDTO getBaseInfo() {
        return baseInfo;
    }

    /**
     * @param baseInfo the baseInfo to set
     */
    public void setBaseInfo(BaseServiceDetailDTO baseInfo) {
        this.baseInfo = baseInfo;
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
