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
public class ListTourismSvcDTO {
    private ListBaseServiceDTO baseInfo;
    @JsonFormat(timezone = "Asia/Ho_Chi_Minh", pattern = "dd/MM/yyyy")
    private Date startDate;
    @JsonFormat(timezone = "Asia/Ho_Chi_Minh", pattern = "dd/MM/yyyy")
    private Date endDate;
    private String location;

    public ListTourismSvcDTO() {
    }

    public ListTourismSvcDTO(Integer id, String name, BigDecimal price,String image,
            Double avgRating, Long reviewCount, Long bookingCount, Date startDate, Date endDate,
            String location) {
        this.baseInfo = new ListBaseServiceDTO(id, name, price, image, avgRating, reviewCount, bookingCount);
        this.startDate = startDate;
        this.endDate = endDate;
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

    /**
     * @return the start_date
     */
    public Date getStartDate() {
        return startDate;
    }

    /**
     * @param start_date the start_date to set
     */
    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    /**
     * @return the end_date
     */
    public Date getEndDate() {
        return endDate;
    }

    /**
     * @param end_date the end_date to set
     */
    public void setEndDate(Date endDate) {
        this.endDate = endDate;
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
