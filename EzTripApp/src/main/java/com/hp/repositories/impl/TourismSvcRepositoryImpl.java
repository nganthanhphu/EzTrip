/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.hp.dto.service.BaseServiceViewDTO;
import com.hp.dto.service.TourismListViewDTO;
import com.hp.dto.service.TourismViewDTO;
import com.hp.pojo.BaseUser;
import com.hp.pojo.Booking;
import com.hp.pojo.BookingStatus;
import com.hp.pojo.Image;
import com.hp.pojo.ProviderProfile;
import com.hp.pojo.Review;
import com.hp.pojo.Service;
import com.hp.pojo.ServiceTourism;
import com.hp.repositories.TourismSvcRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
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
public class TourismSvcRepositoryImpl implements TourismSvcRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Autowired
    private Environment env;

    @Override
    public List<TourismListViewDTO> getTourismServices(Map<String, String> params) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<TourismListViewDTO> q = b.createQuery(TourismListViewDTO.class);
        Root<Service> root = q.from(Service.class);

        Subquery<String> imageUrl = q.subquery(String.class);
        Root<Image> image = imageUrl.from(Image.class);
        imageUrl.select(b.least(image.<String>get("url")));
        imageUrl.where(b.equal(image.get("serviceId").as(Integer.class), root.get("id")));

        Join<Service, ProviderProfile> provider = root.join("providerId", JoinType.INNER);
        Join<Service, ServiceTourism> tourism = root.join("serviceTourism", JoinType.INNER);
        Join<Service, Booking> booking = root.join("bookingSet", JoinType.LEFT);
        Join<Booking, BookingStatus> bookingStatus = booking.join("statusId", JoinType.LEFT);
        Join<Booking, Review> review = booking.join("review", JoinType.LEFT);

        Expression<Integer> confirmedCount = b.sum(
                b.<Integer>selectCase()
                        .when(b.equal(bookingStatus.get("name"), "CONFIRMED"), 1)
                        .otherwise(0));

        Expression<Integer> remainingQuantity = b.diff(
                root.get("quantity"),
                b.coalesce(confirmedCount, 0));

        q.select(b.construct(TourismListViewDTO.class,
                root.get("id"),
                root.get("name"),
                root.get("price"),
                imageUrl,
                root.get("quantity"),
                remainingQuantity,
                b.coalesce(b.avg(review.get("rating")), 0.0),
                b.coalesce(b.count(review.get("id")), 0),
                b.coalesce(b.countDistinct(booking.get("id")), 0),
                provider.get("companyName"),
                tourism.get("tourDuration"),
                tourism.get("location")));

        q.orderBy(b.desc(root.get("id")));

        List<Predicate> predicates = new ArrayList<>();
        List<Predicate> havingPredicates = new ArrayList<>();

        predicates.add(b.equal(root.get("isActive"), true));
        havingPredicates.add(b.greaterThan(remainingQuantity, 0));

        if (params != null) {
            String location = params.get("location");
            if (location != null && !location.isEmpty()) {
                predicates.add(b.like(tourism.get("location"), String.format("%%%s%%", location)));
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

        Query<TourismListViewDTO> query = s.createQuery(q);

        int pageSize = this.env.getProperty("PAGE_SIZE", Integer.class);
        int page = 1;
        if (params != null)
            page = Integer.parseInt(params.getOrDefault("page", "1"));

        int start = (page - 1) * pageSize;
        query.setFirstResult(start);
        query.setMaxResults(pageSize);

        return query.getResultList();
    }

    @Override
    public TourismViewDTO getTourismById(Integer id) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<TourismViewDTO> q = b.createQuery(TourismViewDTO.class);
        Root<Service> root = q.from(Service.class);

        Join<Service, ProviderProfile> providerProfile = root.join("providerId", JoinType.INNER);
        Join<ProviderProfile, BaseUser> providerUser = providerProfile.join("userId", JoinType.INNER);
        Join<Service, ServiceTourism> tourism = root.join("serviceTourism", JoinType.INNER);
        Join<Service, Booking> booking = root.join("bookingSet", JoinType.LEFT);
        Join<Booking, BookingStatus> bookingStatus = booking.join("statusId", JoinType.LEFT);
        Join<Booking, Review> review = booking.join("review", JoinType.LEFT);

        Expression<Integer> confirmedCount = b.sum(
                b.<Integer>selectCase().when(b.equal(bookingStatus.get("name"), "CONFIRMED"), 1).otherwise(0));

        Expression<Integer> remainingQuantity = b.diff(root.get("quantity"), b.coalesce(confirmedCount, 0));

        q.select(b.construct(TourismViewDTO.class,
                root.get("id"),
                root.get("name"),
                root.get("description"),
                root.get("price"),
                root.get("quantity"),
                remainingQuantity,
                b.coalesce(b.avg(review.get("rating")), 0.0),
                b.coalesce(b.count(review.get("id")), 0),
                b.coalesce(b.countDistinct(booking.get("id")), 0),
                providerProfile.get("companyName"),
                providerProfile.get("companyAddress"),
                providerUser.get("phoneNumber"),
                providerUser.get("email"),
                tourism.get("id"),
                tourism.get("tourDuration"),
                tourism.get("location")));

        q.where(b.and(
                b.equal(root.get("id"), id),
                b.equal(root.get("isActive"), true)));

        q.groupBy(root.get("id"));

        Query<TourismViewDTO> query = s.createQuery(q);
        TourismViewDTO result = query.uniqueResult();
        if (result != null) {
            Query<String> imageQuery = s.createQuery("SELECT i.url FROM Image i WHERE i.serviceId.id = :serviceId",
                    String.class);
            imageQuery.setParameter("serviceId", id);
            Set<String> imageUrls = new HashSet<>(imageQuery.getResultList());
            BaseServiceViewDTO baseInfo = result.baseInfo().setImages(imageUrls);
            result = new TourismViewDTO(baseInfo, result.id(), result.tourDuration(), result.location());
        }

        return result;
    }

    @Override
    public void addOrUpdateTourism(Service svc) {
        Session s = this.factory.getObject().getCurrentSession();
        if (svc.getId() != null)
            s.merge(svc);
        else
            s.persist(svc);
    }
}
