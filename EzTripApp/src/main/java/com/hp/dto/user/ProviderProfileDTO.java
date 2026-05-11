/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.dto.user;

/**
 *
 * @author Joon
 */
public class ProviderProfileDTO {

    private Integer id;
    private String companyName;
    private String companyAddress;
    private String typeOfProvider;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyAddress() {
        return companyAddress;
    }

    public void setCompanyAddress(String companyAddress) {
        this.companyAddress = companyAddress;
    }

    public String getTypeOfProvider() {
        return typeOfProvider;
    }

    public void setTypeOfProvider(String typeOfProvider) {
        this.typeOfProvider = typeOfProvider;
    }
}
