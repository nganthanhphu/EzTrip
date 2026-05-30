/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories.impl;

import com.hp.pojo.Review;
import com.hp.repositories.ReviewRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
    public List<Review> getReviewsByServiceId(int serviceId, Map<String, String> params) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Review> q = b.createQuery(Review.class);
        Root<Review> root = q.from(Review.class);

        root.fetch("bookingId", JoinType.INNER).fetch("customerId", JoinType.INNER).fetch("userId", JoinType.INNER);

        q.select(root);

        List<Predicate> predicates = new ArrayList<>();

        predicates.add(b.equal(root.get("bookingId").get("serviceId").get("id"), serviceId));

        if (params != null) {

            String rating = params.get("rating");
            if (rating != null && !rating.isEmpty()) {
                try {
                    predicates.add(b.greaterThanOrEqualTo(root.get("rating"), Integer.parseInt(rating)));
                } catch (NumberFormatException e) {

                }
            }

        }

        q.where(predicates.toArray(Predicate[]::new));

        Query<Review> query = s.createQuery(q);

        int pageSize = this.env.getProperty("PAGE_SIZE", Integer.class);
        int page = 1;
        if (params != null)
            try {
                page = Integer.parseInt(params.getOrDefault("page", "1"));
            } catch (NumberFormatException e) {
                page = 1;
            }

        int start = (page - 1) * pageSize;
        query.setFirstResult(start);
        query.setMaxResults(pageSize);

        return query.getResultList();
    }

    @Override
    public void addReview(Review review) {
        Session s = this.factory.getObject().getCurrentSession();
        s.persist(review);
    }

}
