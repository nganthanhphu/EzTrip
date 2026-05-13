/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
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

import com.hp.dto.service.ListAccommodationSvcDTO;
import com.hp.repositories.AccommodationSvcRepository;
import com.hp.pojo.Booking;
import com.hp.pojo.Image;
import com.hp.pojo.Review;
import com.hp.pojo.Service;
import com.hp.pojo.ServiceAccommodation;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

/**
 *
 * @author Joon
 */
@Repository
@Transactional
@PropertySource("classpath:application.properties")
public class AccommodationSvcRepositoryImpl implements AccommodationSvcRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Autowired
    private Environment env;

    @Override
    public List<ListAccommodationSvcDTO> getAccommodationServices(Map<String, String> params) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<ListAccommodationSvcDTO> q = b.createQuery(ListAccommodationSvcDTO.class);
        Root<Service> root = q.from(Service.class);

        Subquery<String> imageUrl = q.subquery(String.class);
        Root<Image> image = imageUrl.from(Image.class);
        imageUrl.select(b.least(image.<String>get("url")));
        imageUrl.where(b.equal(image.get("serviceId").as(Integer.class), root.get("id")));

        Join<Service, ServiceAccommodation> accommodation = root.join("serviceAccommodation", JoinType.INNER);
        Join<Service, Booking> booking = root.join("bookingSet", JoinType.LEFT);
        Join<Booking, Review> review = booking.join("review", JoinType.LEFT);

        q.select(b.construct(
                ListAccommodationSvcDTO.class,
                root.get("id"),
                root.get("name"),
                root.get("price"),
                imageUrl,
                b.coalesce(b.avg(review.get("rating")), 0.0),
                b.count(review.get("id")),
                b.countDistinct(booking.get("id")),
                accommodation.get("checkInDate"),
                accommodation.get("checkOutDate"),
                accommodation.get("location")));

        q.orderBy(b.desc(root.get("id")));

        List<Predicate> predicates = new ArrayList<>();
        List<Predicate> havingPredicates = new ArrayList<>();

        predicates.add(b.equal(root.get("isActive"), true));
        predicates.add(b.greaterThan(root.get("quantity"), 0));

        if (params != null) {

            String location = params.get("location");
            if (location != null && !location.isEmpty()) {
                predicates.add(b.like(accommodation.get("location"), String.format("%%%s%%", location)));
            }

            String fromPrice = params.get("fromPrice");
            if (fromPrice != null && !fromPrice.isEmpty()) {
                try {
                    predicates.add(b.greaterThanOrEqualTo(root.get("price"), new BigDecimal(fromPrice)));
                } catch (NumberFormatException e) {

                }
            }

            String toPrice = params.get("toPrice");
            if (toPrice != null && !toPrice.isEmpty()) {
                try {
                    predicates.add(b.lessThanOrEqualTo(root.get("price"), new BigDecimal(toPrice)));
                } catch (NumberFormatException e) {

                }
            }

            DateTimeFormatter dateFormat = DateTimeFormatter.ISO_LOCAL_DATE;

            String startDate = params.get("fromDate");
            if (startDate != null && !startDate.isEmpty()) {
                try {
                    LocalDate startDateObj = LocalDate.parse(startDate, dateFormat);
                    predicates
                            .add(b.greaterThanOrEqualTo(accommodation.get("checkInDate"), startDateObj));
                } catch (DateTimeParseException e) {

                }
            }

            String endDate = params.get("toDate");
            if (endDate != null && !endDate.isEmpty()) {
                try {
                    LocalDate endDateObj = LocalDate.parse(endDate, dateFormat);
                    predicates.add(b.lessThanOrEqualTo(accommodation.get("checkOutDate"), endDateObj));
                } catch (DateTimeParseException e) {

                }
            }

            String rating = params.get("rating");
            if (rating != null && !rating.isEmpty()) {
                try {
                    havingPredicates
                            .add(b.greaterThanOrEqualTo(b.avg(review.get("rating")), Double.parseDouble(rating)));
                } catch (NumberFormatException e) {

                }
            }

            String hot = params.get("hot");
            if (hot != null && !hot.isEmpty() && Boolean.parseBoolean(hot)) {
                q.orderBy(b.desc(b.countDistinct(booking.get("id"))));
            }

        }

        q.where(predicates.toArray(Predicate[]::new));

        if (!havingPredicates.isEmpty()) {
            q.having(havingPredicates.toArray(Predicate[]::new));
        }

        q.groupBy(root.get("id"));

        Query<ListAccommodationSvcDTO> query = s.createQuery(q);

        if (params != null) {
            int pageSize = this.env.getProperty("PAGE_SIZE", Integer.class);
            int page = Integer.parseInt(params.getOrDefault("page", "1"));
            int start = (page - 1) * pageSize;

            query.setMaxResults(pageSize);
            query.setFirstResult(start);
        }

        return query.getResultList();
    }
}
