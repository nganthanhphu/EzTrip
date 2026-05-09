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

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 *
 * @author Joon
 */
@Entity
@Table(name = "type_of_provider")
@NamedQueries({
    @NamedQuery(name = "TypeOfProvider.findAll", query = "SELECT t FROM TypeOfProvider t"),
    @NamedQuery(name = "TypeOfProvider.findById", query = "SELECT t FROM TypeOfProvider t WHERE t.id = :id"),
    @NamedQuery(name = "TypeOfProvider.findByName", query = "SELECT t FROM TypeOfProvider t WHERE t.name = :name")})
@JsonIgnoreProperties({"providerProfileSet"})
public class TypeOfProvider implements Serializable {

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
    @OneToMany(mappedBy = "typeOfProviderId")
    private Set<ProviderProfile> providerProfileSet;

    public TypeOfProvider() {
    }

    public TypeOfProvider(Integer id) {
        this.id = id;
    }

    public TypeOfProvider(Integer id, String name) {
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

    public Set<ProviderProfile> getProviderProfileSet() {
        return providerProfileSet;
    }

    public void setProviderProfileSet(Set<ProviderProfile> providerProfileSet) {
        this.providerProfileSet = providerProfileSet;
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
        if (!(object instanceof TypeOfProvider)) {
            return false;
        }
        TypeOfProvider other = (TypeOfProvider) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.hp.pojo.TypeOfProvider[ id=" + id + " ]";
    }
    
}
