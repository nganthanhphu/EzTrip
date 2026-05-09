/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories.impl;

import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;

import com.hp.pojo.TypeOfProvider;
import com.hp.repositories.TypeOfProviderRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Joon
 */
@Repository
public class TypeOfProviderRepositoryImpl implements TypeOfProviderRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public TypeOfProvider getTypeOfProviderByName(String name) {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("TypeOfProvider.findByName", TypeOfProvider.class);
        q.setParameter("name", name);
        return (TypeOfProvider) q.uniqueResult();
    }
}
