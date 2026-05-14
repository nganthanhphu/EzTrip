/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories.impl;

import com.hp.pojo.BaseUser;
import com.hp.repositories.UserRepository;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Joon
 */
@Repository
@Transactional
public class UserRepositoryImpl implements UserRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public BaseUser getUserByPhone(String phoneNumber) {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("BaseUser.findByPhoneNumber", BaseUser.class);
        q.setParameter("phoneNumber", phoneNumber);
        return (BaseUser) q.uniqueResult();
    }

    @Override
    public BaseUser addUser(BaseUser u) {
        Session s = this.factory.getObject().getCurrentSession();
        s.persist(u);
        return u;
    }

    @Override
    public BaseUser authenticate(String phoneNumber, String password) {
        BaseUser u = this.getUserByPhone(phoneNumber);
        if (u != null) {
            if (passwordEncoder.matches(password, u.getPassword())) {
                return u;
            }
        }
        return null;
    }

}
