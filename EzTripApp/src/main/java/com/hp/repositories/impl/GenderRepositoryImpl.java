/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories.impl;

import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;

import com.hp.pojo.Gender;
import com.hp.repositories.GenderRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Joon
 */
@Repository
public class GenderRepositoryImpl implements GenderRepository{

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Gender getGenderByName(String name) {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("Gender.findByName", Gender.class);
        q.setParameter("name", name);
        return (Gender) q.uniqueResult();
    }
}
