/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.service;

import java.math.BigDecimal;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 *
 * @author Joon
 */
public class ListAccommodationSvcDTO {
    private ListBaseServiceDTO baseInfo;
    @JsonFormat(timezone = "Asia/Ho_Chi_Minh", pattern = "dd/MM/yyyy")
    private Date checkInDate;
    @JsonFormat(timezone = "Asia/Ho_Chi_Minh", pattern = "dd/MM/yyyy")
    private Date checkOutDate;
    private String location;

    public ListAccommodationSvcDTO() {
    }

    public ListAccommodationSvcDTO(Integer id, String name, BigDecimal price, String image,
            Double avgRating, Long reviewCount, Long bookingCount, Date checkInDate, Date checkOutDate,
            String location) {
        this.baseInfo = new ListBaseServiceDTO(id, name, price, image, avgRating, reviewCount, bookingCount);
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.location = location;
    }

    /**
     * @return the checkInDate
     */
    public Date getCheckInDate() {
        return checkInDate;
    }

    /**
     * @param checkInDate the checkInDate to set
     */
    public void setCheckInDate(Date checkInDate) {
        this.checkInDate = checkInDate;
    }

    /**
     * @return the checkOutDate
     */
    public Date getCheckOutDate() {
        return checkOutDate;
    }

    /**
     * @param checkOutDate the checkOutDate to set
     */
    public void setCheckOutDate(Date checkOutDate) {
        this.checkOutDate = checkOutDate;
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
    public ListBaseServiceDTO getBaseInfo() {
        return baseInfo;
    }

    /**
     * @param baseInfo the baseInfo to set
     */
    public void setBaseInfo(ListBaseServiceDTO baseInfo) {
        this.baseInfo = baseInfo;
    }
}
