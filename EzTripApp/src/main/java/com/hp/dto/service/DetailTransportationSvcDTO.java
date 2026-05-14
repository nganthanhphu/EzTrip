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
public class DetailTransportationSvcDTO {

    private DetailBaseServiceDTO baseInfo;
    private Integer id;
    private String arrivalLocation;
    private String departureLocation;
    @JsonFormat(timezone = "Asia/Ho_Chi_Minh", pattern = "dd/MM/yyyy HH:mm")
    private Date arrivalTime;
    @JsonFormat(timezone = "Asia/Ho_Chi_Minh", pattern = "dd/MM/yyyy HH:mm")
    private Date departureTime;
    private String typeOfTransportation;

    public DetailTransportationSvcDTO() {
    }

    public DetailTransportationSvcDTO(DetailBaseServiceDTO baseInfo, Integer id, String arrivalLocation, String departureLocation, Date arrivalTime, Date departureTime, String typeOfTransportation) {
        this.baseInfo = baseInfo;
        this.id = id;
        this.arrivalLocation = arrivalLocation;
        this.departureLocation = departureLocation;
        this.arrivalTime = arrivalTime;
        this.departureTime = departureTime;
        this.typeOfTransportation = typeOfTransportation;
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
     * @return the departureTime
     */
    public Date getDepartureTime() {
        return departureTime;
    }

    /**
     * @param departureTime the departureTime to set
     */
    public void setDepartureTime(Date departureTime) {
        this.departureTime = departureTime;
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
