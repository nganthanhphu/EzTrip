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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;

/**
 *
 * @author Joon
 */
@Entity
@Table(name = "service_transportation")
@NamedQueries({
    @NamedQuery(name = "ServiceTransportation.findAll", query = "SELECT s FROM ServiceTransportation s"),
    @NamedQuery(name = "ServiceTransportation.findById", query = "SELECT s FROM ServiceTransportation s WHERE s.id = :id"),
    @NamedQuery(name = "ServiceTransportation.findByDepartureLocation", query = "SELECT s FROM ServiceTransportation s WHERE s.departureLocation = :departureLocation"),
    @NamedQuery(name = "ServiceTransportation.findByArrivalLocation", query = "SELECT s FROM ServiceTransportation s WHERE s.arrivalLocation = :arrivalLocation"),
    @NamedQuery(name = "ServiceTransportation.findByDepartureTime", query = "SELECT s FROM ServiceTransportation s WHERE s.departureTime = :departureTime"),
    @NamedQuery(name = "ServiceTransportation.findByArrivalTime", query = "SELECT s FROM ServiceTransportation s WHERE s.arrivalTime = :arrivalTime")})
public class ServiceTransportation implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "departure_location")
    private String departureLocation;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "arrival_location")
    private String arrivalLocation;
    @Basic(optional = false)
    @NotNull
    @Column(name = "departure_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date departureTime;
    @Basic(optional = false)
    @NotNull
    @Column(name = "arrival_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date arrivalTime;
    @JoinColumn(name = "service_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Service serviceId;
    @JoinColumn(name = "type_of_transportation_id", referencedColumnName = "id")
    @ManyToOne
    private TypeOfTransportation typeOfTransportationId;

    public ServiceTransportation() {
    }

    public ServiceTransportation(Integer id) {
        this.id = id;
    }

    public ServiceTransportation(Integer id, String departureLocation, String arrivalLocation, Date departureTime, Date arrivalTime) {
        this.id = id;
        this.departureLocation = departureLocation;
        this.arrivalLocation = arrivalLocation;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDepartureLocation() {
        return departureLocation;
    }

    public void setDepartureLocation(String departureLocation) {
        this.departureLocation = departureLocation;
    }

    public String getArrivalLocation() {
        return arrivalLocation;
    }

    public void setArrivalLocation(String arrivalLocation) {
        this.arrivalLocation = arrivalLocation;
    }

    public Date getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(Date departureTime) {
        this.departureTime = departureTime;
    }

    public Date getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(Date arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public Service getServiceId() {
        return serviceId;
    }

    public void setServiceId(Service serviceId) {
        this.serviceId = serviceId;
    }

    public TypeOfTransportation getTypeOfTransportationId() {
        return typeOfTransportationId;
    }

    public void setTypeOfTransportationId(TypeOfTransportation typeOfTransportationId) {
        this.typeOfTransportationId = typeOfTransportationId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof ServiceTransportation)) {
            return false;
        }
        ServiceTransportation other = (ServiceTransportation) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.hp.pojo.ServiceTransportation[ id=" + id + " ]";
    }
    
}
