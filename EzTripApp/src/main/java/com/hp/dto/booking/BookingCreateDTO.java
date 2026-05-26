/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.booking;

/**
 *
 * @author Joon
 */
public class BookingCreateDTO {

   private Integer serviceId;
   private Integer paymentMethodId;
   private String bookingDay;
   private int quantity;
   private String note;

    /**
     * @return the serviceId
     */
    public Integer getServiceId() {
        return serviceId;
    }

    /**
     * @param serviceId the serviceId to set
     */
    public void setServiceId(Integer serviceId) {
        this.serviceId = serviceId;
    }

    /**
     * @return the paymentMethodId
     */
    public Integer getPaymentMethodId() {
        return paymentMethodId;
    }

    /**
     * @param paymentMethodId the paymentMethodId to set
     */
    public void setPaymentMethodId(Integer paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    /**
     * @return the bookingDay
     */
    public String getBookingDay() {
        return bookingDay;
    }

    /**
     * @param bookingDay the bookingDay to set
     */
    public void setBookingDay(String bookingDay) {
        this.bookingDay = bookingDay;
    }

    /**
     * @return the quantity
     */
    public int getQuantity() {
        return quantity;
    }

    /**
     * @param quantity the quantity to set
     */
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    /**
     * @return the note
     */
    public String getNote() {
        return note;
    }

    /**
     * @param note the note to set
     */
    public void setNote(String note) {
        this.note = note;
    }
    
}
