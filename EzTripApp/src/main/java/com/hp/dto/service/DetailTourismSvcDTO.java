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
public class DetailTourismSvcDTO {
    private DetailBaseServiceDTO baseInfo;
    private Integer id;
    @JsonFormat(timezone = "Asia/Ho_Chi_Minh", pattern = "dd/MM/yyyy")
    private Date startDate;
    @JsonFormat(timezone = "Asia/Ho_Chi_Minh", pattern = "dd/MM/yyyy")
    private Date endDate;
    private String location;

    public DetailTourismSvcDTO() {
    }

    public DetailTourismSvcDTO(DetailBaseServiceDTO baseInfo, Integer id, Date startDate, Date endDate, String location) {
        this.baseInfo = baseInfo;
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
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
     * @return the startDate
     */
    public Date getStartDate() {
        return startDate;
    }

    /**
     * @param startDate the startDate to set
     */
    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    /**
     * @return the endDate
     */
    public Date getEndDate() {
        return endDate;
    }

    /**
     * @param endDate the endDate to set
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
