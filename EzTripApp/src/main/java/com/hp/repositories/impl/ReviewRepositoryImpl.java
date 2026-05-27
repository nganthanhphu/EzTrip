/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories.impl;

import com.hp.pojo.Review;
import com.hp.repositories.ReviewRepository;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Joon
 */

@Repository
@Transactional
@PropertySource("classpath:application.properties")
public class ReviewRepositoryImpl implements ReviewRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Autowired
    private Environment env;

    @Override
    public List<Review> getReviewsByServiceId(int serviceId, int page) {
        Session s = this.factory.getObject().getCurrentSession();
        Query<Review> q = s.createQuery("FROM Review r WHERE r.bookingId.serviceId.id = :serviceId", Review.class);
        q.setParameter("serviceId", serviceId);

        if (page < 1) {
            page = 1;
        }
        int pageSize = this.env.getProperty("PAGE_SIZE", Integer.class);
        int start = (page - 1) * pageSize;
        q.setFirstResult(start);
        q.setMaxResults(pageSize);

        return q.getResultList();
    }

    @Override
    public void addReview(Review review) {
        Session s = this.factory.getObject().getCurrentSession();
        s.persist(review);
    }

}
