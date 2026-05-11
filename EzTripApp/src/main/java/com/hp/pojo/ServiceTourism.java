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
import jakarta.persistence.OneToOne;
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
@Table(name = "service_tourism")
@NamedQueries({
    @NamedQuery(name = "ServiceTourism.findAll", query = "SELECT s FROM ServiceTourism s"),
    @NamedQuery(name = "ServiceTourism.findById", query = "SELECT s FROM ServiceTourism s WHERE s.id = :id"),
    @NamedQuery(name = "ServiceTourism.findByStartDate", query = "SELECT s FROM ServiceTourism s WHERE s.startDate = :startDate"),
    @NamedQuery(name = "ServiceTourism.findByEndDate", query = "SELECT s FROM ServiceTourism s WHERE s.endDate = :endDate"),
    @NamedQuery(name = "ServiceTourism.findByLocation", query = "SELECT s FROM ServiceTourism s WHERE s.location = :location")})
public class ServiceTourism implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Column(name = "start_date")
    @Temporal(TemporalType.DATE)
    private Date startDate;
    @Basic(optional = false)
    @NotNull
    @Column(name = "end_date")
    @Temporal(TemporalType.DATE)
    private Date endDate;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "location")
    private String location;
    @JoinColumn(name = "service_id", referencedColumnName = "id", unique = true)
    @OneToOne(optional = false)
    private Service serviceId;

    public ServiceTourism() {
    }

    public ServiceTourism(Integer id) {
        this.id = id;
    }

    public ServiceTourism(Integer id, Date startDate, Date endDate, String location) {
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.location = location;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
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
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof ServiceTourism)) {
            return false;
        }
        ServiceTourism other = (ServiceTourism) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.hp.pojo.ServiceTourism[ id=" + id + " ]";
    }
    
}
