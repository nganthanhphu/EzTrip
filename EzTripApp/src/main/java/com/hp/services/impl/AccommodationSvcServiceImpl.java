/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hp.dto.service.DetailAccommodationSvcDTO;
import com.hp.dto.service.DetailBaseServiceDTO;
import com.hp.dto.service.ListViewAccommodationSvcDTO;
import com.hp.repositories.AccommodationSvcRepository;
import com.hp.services.AccommodationSvcService;

/**
 *
 * @author Joon
 */
@Service
@Transactional
public class AccommodationSvcServiceImpl implements AccommodationSvcService {

    @Autowired
    private AccommodationSvcRepository accommodationSvcRepository;

    @Override
    public List<ListViewAccommodationSvcDTO> getAccommodationServices(Map<String, String> params) {
        return this.accommodationSvcRepository.getAccommodationServices(params);
    }

    @Override
    public DetailAccommodationSvcDTO getAccommodationById(Integer id) {
        com.hp.pojo.Service svc = this.accommodationSvcRepository.getAccommodationById(id);
        return this.toDetailAccommodationSvcDTO(svc);
    }

    private DetailAccommodationSvcDTO toDetailAccommodationSvcDTO(com.hp.pojo.Service svc) {
        DetailBaseServiceDTO baseInfo = new DetailBaseServiceDTO();
        baseInfo.setId(svc.getId());
        baseInfo.setName(svc.getName());
        baseInfo.setDescription(svc.getDescription());
        baseInfo.setPrice(svc.getPrice());
        Set<String> images = svc.getImageSet().stream().map(img -> img.getUrl()).collect(Collectors.toSet());
        baseInfo.setImages(images);
        DetailAccommodationSvcDTO detail = new DetailAccommodationSvcDTO();
        detail.setBaseInfo(baseInfo);
        detail.setId(svc.getServiceAccommodation().getId());
        detail.setCheckInDate(svc.getServiceAccommodation().getCheckInDate());
        detail.setCheckOutDate(svc.getServiceAccommodation().getCheckOutDate());
        detail.setQuantityOfBed(svc.getServiceAccommodation().getQuantityOfBed());
        detail.setArea(svc.getServiceAccommodation().getArea());
        detail.setLocation(svc.getServiceAccommodation().getLocation());
        return detail;
    }

}
