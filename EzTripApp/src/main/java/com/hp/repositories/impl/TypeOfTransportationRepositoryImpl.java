/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories.impl;

import com.hp.pojo.TypeOfTransportation;
import com.hp.repositories.TypeOfTransportationRepository;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Joon
 */
@Repository
public class TypeOfTransportationRepositoryImpl implements TypeOfTransportationRepository{
    
    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public TypeOfTransportation getTypeOfTransportationByName(String name) {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("TypeOfTransportation.findByName", TypeOfTransportation.class);
        q.setParameter("name", name);
        return (TypeOfTransportation) q.uniqueResult();
    }
    
}
