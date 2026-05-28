/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.hp.pojo.TypeOfService;
import com.hp.repositories.TypeOfServiceRepository;

/**
 *
 * @author Joon
 */
@Repository
@Transactional
public class TypeOfServiceRepositoryImpl implements TypeOfServiceRepository{

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<TypeOfService> getTypeOfServices() {
        Session s = this.factory.getObject().getCurrentSession();
        Query<TypeOfService> q = s.createQuery("SELECT tos FROM TypeOfService tos ORDER BY tos.id", TypeOfService.class);
        return q.getResultList();
    }
    
}
