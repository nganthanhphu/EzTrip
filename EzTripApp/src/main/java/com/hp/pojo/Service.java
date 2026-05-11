/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.pojo;

import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Set;

/**
 *
 * @author Joon
 */
@Entity
@Table(name = "service")
@NamedQueries({
    @NamedQuery(name = "Service.findAll", query = "SELECT s FROM Service s"),
    @NamedQuery(name = "Service.findById", query = "SELECT s FROM Service s WHERE s.id = :id"),
    @NamedQuery(name = "Service.findByName", query = "SELECT s FROM Service s WHERE s.name = :name"),
    @NamedQuery(name = "Service.findByPrice", query = "SELECT s FROM Service s WHERE s.price = :price"),
    @NamedQuery(name = "Service.findByQuantity", query = "SELECT s FROM Service s WHERE s.quantity = :quantity")})
public class Service implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "name")
    private String name;
    @Lob
    @Size(max = 65535)
    @Column(name = "description")
    private String description;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Basic(optional = false)
    @NotNull
    @Column(name = "price")
    private BigDecimal price;
    @Basic(optional = false)
    @NotNull
    @Column(name = "quantity")
    private int quantity;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "serviceId")
    private Set<Image> imageSet;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "serviceId")
    private Set<Booking> bookingSet;
    @OneToOne(cascade = CascadeType.ALL, mappedBy = "serviceId")
    private ServiceAccommodation serviceAccommodation;
    @OneToOne(cascade = CascadeType.ALL, mappedBy = "serviceId")
    private ServiceTourism serviceTourism;
    @JoinColumn(name = "provider_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private ProviderProfile providerId;
    @JoinColumn(name = "type_of_service_id", referencedColumnName = "id")
    @ManyToOne
    private TypeOfService typeOfServiceId;
    @OneToOne(cascade = CascadeType.ALL, mappedBy = "serviceId")
    private ServiceTransportation serviceTransportation;

    public Service() {
    }

    public Service(Integer id) {
        this.id = id;
    }

    public Service(Integer id, String name, BigDecimal price, int quantity) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Set<Image> getImageSet() {
        return imageSet;
    }

    public void setImageSet(Set<Image> imageSet) {
        this.imageSet = imageSet;
    }

    public Set<Booking> getBookingSet() {
        return bookingSet;
    }

    public void setBookingSet(Set<Booking> bookingSet) {
        this.bookingSet = bookingSet;
    }

    public ServiceAccommodation getServiceAccommodation() {
        return serviceAccommodation;
    }

    public void setServiceAccommodation(ServiceAccommodation serviceAccommodation) {
        this.serviceAccommodation = serviceAccommodation;
    }

    public ServiceTourism getServiceTourism() {
        return serviceTourism;
    }

    public void setServiceTourism(ServiceTourism serviceTourism) {
        this.serviceTourism = serviceTourism;
    }

    public ProviderProfile getProviderId() {
        return providerId;
    }

    public void setProviderId(ProviderProfile providerId) {
        this.providerId = providerId;
    }

    public TypeOfService getTypeOfServiceId() {
        return typeOfServiceId;
    }

    public void setTypeOfServiceId(TypeOfService typeOfServiceId) {
        this.typeOfServiceId = typeOfServiceId;
    }

    public ServiceTransportation getServiceTransportation() {
        return serviceTransportation;
    }

    public void setServiceTransportation(ServiceTransportation serviceTransportation) {
        this.serviceTransportation = serviceTransportation;
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
        if (!(object instanceof Service)) {
            return false;
        }
        Service other = (Service) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.hp.pojo.Service[ id=" + id + " ]";
    }
    
}
