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
public class AccommodationSvcListDTO {

    private BaseServiceListDTO baseInfo;
    private int quantityOfBed;
    private float area;
    private String location;

    public AccommodationSvcListDTO() {
    }

    public AccommodationSvcListDTO(Integer id, String name, BigDecimal price, String image, Integer quantity,
            Integer remainingQuantity, Double avgRating, Long reviewCount, Long bookingCount, String companyName,
            int quantityOfBed,
            float area, String location) {
        this.baseInfo = new BaseServiceListDTO(id, name, price, image, quantity, remainingQuantity, avgRating,
                reviewCount, bookingCount, companyName);
        this.quantityOfBed = quantityOfBed;
        this.area = area;
        this.location = location;
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
     * @return the quantityOfBed
     */
    public int getQuantityOfBed() {
        return quantityOfBed;
    }

    /**
     * @param quantityOfBed the quantityOfBed to set
     */
    public void setQuantityOfBed(int quantityOfBed) {
        this.quantityOfBed = quantityOfBed;
    }

    /**
     * @return the area
     */
    public float getArea() {
        return area;
    }

    /**
     * @param area the area to set
     */
    public void setArea(float area) {
        this.area = area;
    }
}
