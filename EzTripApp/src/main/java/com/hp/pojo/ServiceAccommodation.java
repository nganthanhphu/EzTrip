/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.pojo;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;

/**
 *
 * @author Joon
 */
@Entity
@Table(name = "service_accommodation")
@NamedQueries({
    @NamedQuery(name = "ServiceAccommodation.findAll", query = "SELECT s FROM ServiceAccommodation s"),
    @NamedQuery(name = "ServiceAccommodation.findById", query = "SELECT s FROM ServiceAccommodation s WHERE s.id = :id"),
    @NamedQuery(name = "ServiceAccommodation.findByQuantityOfBed", query = "SELECT s FROM ServiceAccommodation s WHERE s.quantityOfBed = :quantityOfBed"),
    @NamedQuery(name = "ServiceAccommodation.findByArea", query = "SELECT s FROM ServiceAccommodation s WHERE s.area = :area"),
    @NamedQuery(name = "ServiceAccommodation.findByLocation", query = "SELECT s FROM ServiceAccommodation s WHERE s.location = :location")})
public class ServiceAccommodation implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Column(name = "quantity_of_bed")
    private int quantityOfBed;
    @Basic(optional = false)
    @NotNull
    @Column(name = "area")
    private float area;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "location")
    private String location;
    @JoinColumn(name = "service_id", referencedColumnName = "id")
    @OneToOne(optional = false)
    private Service serviceId;

    public ServiceAccommodation() {
    }

    public ServiceAccommodation(Integer id) {
        this.id = id;
    }

    public ServiceAccommodation(Integer id, int quantityOfBed, float area, String location) {
        this.id = id;
        this.quantityOfBed = quantityOfBed;
        this.area = area;
        this.location = location;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public int getQuantityOfBed() {
        return quantityOfBed;
    }

    public void setQuantityOfBed(int quantityOfBed) {
        this.quantityOfBed = quantityOfBed;
    }

    public float getArea() {
        return area;
    }

    public void setArea(float area) {
        this.area = area;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Service getServiceId() {
        return serviceId;
    }

    public void setServiceId(Service serviceId) {
        this.serviceId = serviceId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {

        if (!(object instanceof ServiceAccommodation)) {
            return false;
        }
        ServiceAccommodation other = (ServiceAccommodation) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.dht.test.ServiceAccommodation[ id=" + id + " ]";
    }
    
}
