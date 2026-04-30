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
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Set;

/**
 *
 * @author Joon
 */
@Entity
@Table(name = "type_of_transportation")
@NamedQueries({
    @NamedQuery(name = "TypeOfTransportation.findAll", query = "SELECT t FROM TypeOfTransportation t"),
    @NamedQuery(name = "TypeOfTransportation.findById", query = "SELECT t FROM TypeOfTransportation t WHERE t.id = :id"),
    @NamedQuery(name = "TypeOfTransportation.findByName", query = "SELECT t FROM TypeOfTransportation t WHERE t.name = :name")})
public class TypeOfTransportation implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "name")
    private String name;
    @OneToMany(mappedBy = "typeOfTransportationId")
    private Set<ServiceTransportation> serviceTransportationSet;

    public TypeOfTransportation() {
    }

    public TypeOfTransportation(Integer id) {
        this.id = id;
    }

    public TypeOfTransportation(Integer id, String name) {
        this.id = id;
        this.name = name;
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

    public Set<ServiceTransportation> getServiceTransportationSet() {
        return serviceTransportationSet;
    }

    public void setServiceTransportationSet(Set<ServiceTransportation> serviceTransportationSet) {
        this.serviceTransportationSet = serviceTransportationSet;
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
        if (!(object instanceof TypeOfTransportation)) {
            return false;
        }
        TypeOfTransportation other = (TypeOfTransportation) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.hp.pojo.TypeOfTransportation[ id=" + id + " ]";
    }
    
}
