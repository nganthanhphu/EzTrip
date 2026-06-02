/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories.impl;

import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.hp.pojo.Image;
import com.hp.repositories.ImageRepository;

/**
 *
 * @author Joon
 */
@Repository
@Transactional
public class ImageRepositoryImpl implements ImageRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Image getImageById(Integer id) {
        Session s = this.factory.getObject().getCurrentSession();
        Query<Image> query = s.createQuery("""
                SELECT i
                FROM Image i
                LEFT JOIN FETCH i.serviceId s
                LEFT JOIN FETCH s.providerId
                WHERE i.id = :id
                """, Image.class);
        query.setParameter("id", id);
        return query.uniqueResult();
    }

    @Override
    public void deleteImage(Image image) {
        Session s = this.factory.getObject().getCurrentSession();
        s.remove(image);
    }

}
