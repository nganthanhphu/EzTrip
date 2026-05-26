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
public class TransportationSvcListDTO {
    private BaseServiceListDTO baseInfo;
    private String arrivalLocation;
    private String departureLocation;
    private int arrivalTime;
    private int departureTime;
    private String typeOfTransportation;

    public TransportationSvcListDTO() {
    }

    public TransportationSvcListDTO(Integer id, String name, BigDecimal price, String image, Integer quantity,
            Integer remainingQuantity,
            Double avgRating, Long reviewCount, Long bookingCount, String companyName, String arrivalLocation,
            String departureLocation,
            int arrivalTime, int departureTime, String typeOfTransportation) {
        this.baseInfo = new BaseServiceListDTO(id, name, price, image, quantity, remainingQuantity, avgRating,
                reviewCount, bookingCount, companyName);
        this.arrivalLocation = arrivalLocation;
        this.departureLocation = departureLocation;
        this.arrivalTime = arrivalTime;
        this.departureTime = departureTime;
        this.typeOfTransportation = typeOfTransportation;
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
