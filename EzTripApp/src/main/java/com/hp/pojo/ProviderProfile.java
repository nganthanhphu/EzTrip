/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.pojo;

import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 *
 * @author Joon
 */
@Entity
@Table(name = "provider_profile")
@NamedQueries({
    @NamedQuery(name = "ProviderProfile.findAll", query = "SELECT p FROM ProviderProfile p"),
    @NamedQuery(name = "ProviderProfile.findById", query = "SELECT p FROM ProviderProfile p WHERE p.id = :id"),
    @NamedQuery(name = "ProviderProfile.findByCompanyName", query = "SELECT p FROM ProviderProfile p WHERE p.companyName = :companyName"),
    @NamedQuery(name = "ProviderProfile.findByCompanyAddress", query = "SELECT p FROM ProviderProfile p WHERE p.companyAddress = :companyAddress")})
@JsonIgnoreProperties({"serviceSet", "userId"})
public class ProviderProfile implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Size(max = 255)
    @Column(name = "company_name")
    @NotNull
    private String companyName;
    @Size(max = 255)
    @Column(name = "company_address")
    private String companyAddress;
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @OneToOne(optional = false)
    private BaseUser userId;
    @JoinColumn(name = "type_of_provider_id", referencedColumnName = "id")
    @ManyToOne(fetch = FetchType.EAGER)
    @NotNull
    private TypeOfProvider typeOfProviderId;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "providerId")
    private Set<Service> serviceSet;

    public ProviderProfile() {
    }

    public ProviderProfile(Integer id) {
        this.id = id;
    }

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

    public BaseUser getUserId() {
        return userId;
    }

    public void setUserId(BaseUser userId) {
        this.userId = userId;
    }

    public TypeOfProvider getTypeOfProviderId() {
        return typeOfProviderId;
    }

    public void setTypeOfProviderId(TypeOfProvider typeOfProviderId) {
        this.typeOfProviderId = typeOfProviderId;
    }

    public Set<Service> getServiceSet() {
        return serviceSet;
    }

    public void setServiceSet(Set<Service> serviceSet) {
        this.serviceSet = serviceSet;
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
        if (!(object instanceof ProviderProfile)) {
            return false;
        }
        ProviderProfile other = (ProviderProfile) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.hp.pojo.ProviderProfile[ id=" + id + " ]";
    }
    
}
