/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories.impl;

import com.hp.pojo.BaseUser;
import com.hp.repositories.UserRepository;

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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Joon
 */
@Repository
@Transactional
@PropertySource("classpath:application.properties")
public class UserRepositoryImpl implements UserRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private Environment env;

    @Override
    public BaseUser getUserByPhone(String phoneNumber) {
        Session s = this.factory.getObject().getCurrentSession();
        Query<BaseUser> q = s.createNamedQuery("BaseUser.findByPhoneNumber", BaseUser.class);
        q.setParameter("phoneNumber", phoneNumber);
        return q.uniqueResult();
    }

    @Override
    public BaseUser addOrUpdateUser(BaseUser u) {
        Session s = this.factory.getObject().getCurrentSession();
        if (u.getId() != null) {
            s.merge(u);
        } else {
            s.persist(u);
        }
        return u;
    }

    @Override
    public List<BaseUser> getUsers(Map<String, String> params) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<BaseUser> q = b.createQuery(BaseUser.class);
        Root<BaseUser> baseUser = q.from(BaseUser.class);
        baseUser.fetch("customerProfile", JoinType.LEFT).fetch("genderId", JoinType.LEFT);
        baseUser.fetch("providerProfile", JoinType.LEFT).fetch("typeOfProviderId", JoinType.LEFT);
        baseUser.fetch("roleId", JoinType.LEFT);

        List<Predicate> predicates = new ArrayList<>();
        if (params != null) {

            String phoneNumber = params.get("phoneNumber");
            if (phoneNumber != null && !phoneNumber.isEmpty()) {
                predicates.add(b.like(baseUser.get("phoneNumber"), String.format("%%%s%%", phoneNumber)));
            }

            String role = params.get("role");
            if (role != null && !role.isEmpty()) {
                predicates.add(b.equal(baseUser.get("roleId").get("name"), role));
            }

            String fullname = params.get("fullname");
            if (fullname != null && !fullname.isEmpty()) {
                predicates.add(b.like(baseUser.get("fullname"), String.format("%%%s%%", fullname)));
            }

        }

        q.where(predicates.toArray(Predicate[]::new));
        q.orderBy(b.desc(baseUser.get("id")));

        Query<BaseUser> query = s.createQuery(q);

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
    public BaseUser authenticate(String phoneNumber, String password) {
        BaseUser u = this.getUserByPhone(phoneNumber);
        if (u != null) {
            if (passwordEncoder.matches(password, u.getPassword())) {
                return u;
            }
        }
        return null;
    }

    @Override
    public BaseUser getUserById(Integer userId) {
        Session s = this.factory.getObject().getCurrentSession();
        return s.get(BaseUser.class, userId);
    }

}
