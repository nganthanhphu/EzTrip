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
public class AccommodationSvcDetailDTO {

    private BaseServiceDetailDTO baseInfo;
    private Integer id;
    private int quantityOfBed;
    private float area;
    private String location;

    public AccommodationSvcDetailDTO() {
    }

    public AccommodationSvcDetailDTO(BaseServiceDetailDTO baseInfo, Integer id, int quantityOfBed, float area,
            String location) {
        this.baseInfo = baseInfo;
        this.id = id;
        this.quantityOfBed = quantityOfBed;
        this.area = area;
        this.location = location;
    }

    public AccommodationSvcDetailDTO(Integer baseId, String name, String description, BigDecimal price,
            Integer quantity,
            Integer remainingQuantity, Double avgRating, Long reviewCount, Long bookingCount, String companyName,
            String companyAddress,
            String companyPhone, String companyEmail, Integer id, int quantityOfBed, float area,
            String location) {
        this.baseInfo = new BaseServiceDetailDTO(baseId, name, description, price, quantity, remainingQuantity,
                avgRating, reviewCount, bookingCount, companyName, companyAddress, companyPhone, companyEmail);
        this.id = id;
        this.quantityOfBed = quantityOfBed;
        this.area = area;
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

}
