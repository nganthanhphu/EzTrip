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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.io.Serializable;
import java.util.Date;
import java.util.Set;

/**
 *
 * @author Joon
 */
@Entity
@Table(name = "customer_profile")
@NamedQueries({
    @NamedQuery(name = "CustomerProfile.findAll", query = "SELECT c FROM CustomerProfile c"),
    @NamedQuery(name = "CustomerProfile.findById", query = "SELECT c FROM CustomerProfile c WHERE c.id = :id"),
    @NamedQuery(name = "CustomerProfile.findByDob", query = "SELECT c FROM CustomerProfile c WHERE c.dob = :dob")})
public class CustomerProfile implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Column(name = "dob")
    @Temporal(TemporalType.DATE)
    private Date dob;
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @OneToOne(optional = false)
    private BaseUser userId;
    @JoinColumn(name = "gender_id", referencedColumnName = "id")
    @ManyToOne
    private Gender genderId;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "customerId")
    private Set<Booking> bookingSet;

    public CustomerProfile() {
    }

    public CustomerProfile(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public BaseUser getUserId() {
        return userId;
    }

    public void setUserId(BaseUser userId) {
        this.userId = userId;
    }

    public Gender getGenderId() {
        return genderId;
    }

    public void setGenderId(Gender genderId) {
        this.genderId = genderId;
    }

    public Set<Booking> getBookingSet() {
        return bookingSet;
    }

    public void setBookingSet(Set<Booking> bookingSet) {
        this.bookingSet = bookingSet;
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
        if (!(object instanceof CustomerProfile)) {
            return false;
        }
        CustomerProfile other = (CustomerProfile) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.hp.pojo.CustomerProfile[ id=" + id + " ]";
    }
    
}
