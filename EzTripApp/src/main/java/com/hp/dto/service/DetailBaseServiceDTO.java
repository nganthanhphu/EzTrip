/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.service;

import java.math.BigDecimal;
import java.util.Set;

/**
 *
 * @author Joon
 */
public class DetailBaseServiceDTO {

    private Integer id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private Set<String> images;

    public DetailBaseServiceDTO() {
    }

    public DetailBaseServiceDTO(Integer id, String name, String description, BigDecimal price, Integer quantity, Set<String> images) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.images = images;
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
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * @param description the description to set
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * @return the price
     */
    public BigDecimal getPrice() {
        return price;
    }

    /**
     * @param price the price to set
     */
    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    /**
     * @return the quantity
     */
    public Integer getQuantity() {
        return quantity;
    }

    /**
     * @param quantity the quantity to set
     */
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    /**
     * @return the images
     */
    public Set<String> getImages() {
        return images;
    }

    /**
     * @param images the images to set
     */
    public void setImages(Set<String> images) {
        this.images = images;
    }

}
