/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.service;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 *
 * @author Joon
 */
public class DetailAccommodationSvcDTO {

    private DetailBaseServiceDTO baseInfo;
    private Integer id;
    @JsonFormat(timezone = "Asia/Ho_Chi_Minh", pattern = "dd/MM/yyyy")
    private Date checkInDate;
    @JsonFormat(timezone = "Asia/Ho_Chi_Minh", pattern = "dd/MM/yyyy")
    private Date checkOutDate;
    private int quantityOfBed;
    private float area;
    private String location;

    public DetailAccommodationSvcDTO() {
    }

    public DetailAccommodationSvcDTO(DetailBaseServiceDTO baseInfo, Integer id, Date checkInDate, Date checkOutDate, int quantityOfBed, float area, String location) {
        this.baseInfo = baseInfo;
        this.id = id;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.quantityOfBed = quantityOfBed;
        this.area = area;
        this.location = location;
    }

    /**
     * @return the baseInfo
     */
    public DetailBaseServiceDTO getBaseInfo() {
        return baseInfo;
    }

    /**
     * @param baseInfo the baseInfo to set
     */
    public void setBaseInfo(DetailBaseServiceDTO baseInfo) {
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
