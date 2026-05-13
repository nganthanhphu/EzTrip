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
public class ListViewTransportationSvcDTO {
    private ListViewBaseServiceDTO baseInfo;
    private String arrivalLocation;
    private String departureLocation;
    @JsonFormat(timezone = "Asia/Ho_Chi_Minh", pattern = "dd/MM/yyyy HH:mm")
    private Date arrivalTime;
    private String typeOfTransportation;

    public ListViewTransportationSvcDTO() {
    }

    public ListViewTransportationSvcDTO(Integer id, String name, BigDecimal price, String image,
            Double avgRating, Long reviewCount, Long bookingCount, String arrivalLocation, String departureLocation,
            Date arrivalTime, String typeOfTransportation) {
        this.baseInfo = new ListViewBaseServiceDTO(id, name, price, image, avgRating, reviewCount,
                bookingCount);
        this.arrivalLocation = arrivalLocation;
        this.departureLocation = departureLocation;
        this.arrivalTime = arrivalTime;
        this.typeOfTransportation = typeOfTransportation;
    }

    /**
     * @return the baseInfo
     */
    public ListViewBaseServiceDTO getBaseInfo() {
        return baseInfo;
    }

    /**
     * @param baseInfo the baseInfo to set
     */
    public void setBaseInfo(ListViewBaseServiceDTO baseInfo) {
        this.baseInfo = baseInfo;
    }

    /**
     * @return the arrivalLocation
     */
    public String getArrivalLocation() {
        return arrivalLocation;
    }

    /**
     * @param arrivalLocation the arrivalLocation to set
     */
    public void setArrivalLocation(String arrivalLocation) {
        this.arrivalLocation = arrivalLocation;
    }

    /**
     * @return the departureLocation
     */
    public String getDepartureLocation() {
        return departureLocation;
    }

    /**
     * @param departureLocation the departureLocation to set
     */
    public void setDepartureLocation(String departureLocation) {
        this.departureLocation = departureLocation;
    }

    /**
     * @return the arrivalTime
     */
    public Date getArrivalTime() {
        return arrivalTime;
    }

    /**
     * @param arrivalTime the arrivalTime to set
     */
    public void setArrivalTime(Date arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    /**
     * @return the typeOfTransportation
     */
    public String getTypeOfTransportation() {
        return typeOfTransportation;
    }

    /**
     * @param typeOfTransportation the typeOfTransportation to set
     */
    public void setTypeOfTransportation(String typeOfTransportation) {
        this.typeOfTransportation = typeOfTransportation;
    }

}
