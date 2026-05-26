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
public class TransportationSvcDetailDTO {

    private BaseServiceDetailDTO baseInfo;
    private Integer id;
    private String arrivalLocation;
    private String departureLocation;
    private int arrivalTime;
    private int departureTime;
    private String typeOfTransportation;

    public TransportationSvcDetailDTO() {
    }

    public TransportationSvcDetailDTO(BaseServiceDetailDTO baseInfo, Integer id, String arrivalLocation, String departureLocation, int arrivalTime, int departureTime, String typeOfTransportation) {
        this.baseInfo = baseInfo;
        this.id = id;
        this.arrivalLocation = arrivalLocation;
        this.departureLocation = departureLocation;
        this.arrivalTime = arrivalTime;
        this.departureTime = departureTime;
        this.typeOfTransportation = typeOfTransportation;
    }

    public TransportationSvcDetailDTO(Integer baseId, String name, String description, BigDecimal price,
            Integer quantity, Integer remainingQuantity, Double avgRating, Long reviewCount, Long bookingCount,
            String companyName, String companyAddress, String companyPhone, String companyEmail, Integer id,
            String arrivalLocation, String departureLocation, int arrivalTime, int departureTime,
            String typeOfTransportation) {
        this.baseInfo = new BaseServiceDetailDTO(baseId, name, description, price, quantity, remainingQuantity,
                avgRating, reviewCount, bookingCount, companyName, companyAddress, companyPhone, companyEmail);
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
    public int getArrivalTime() {
        return arrivalTime;
    }

    /**
     * @param arrivalTime the arrivalTime to set
     */
    public void setArrivalTime(int arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    /**
     * @return the departureTime
     */
    public int getDepartureTime() {
        return departureTime;
    }

    /**
     * @param departureTime the departureTime to set
     */
    public void setDepartureTime(int departureTime) {
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
