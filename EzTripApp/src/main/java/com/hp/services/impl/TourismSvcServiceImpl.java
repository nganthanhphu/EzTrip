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

import com.hp.dto.service.DetailBaseServiceDTO;
import com.hp.dto.service.DetailTourismSvcDTO;
import com.hp.dto.service.ListViewTourismSvcDTO;
import com.hp.repositories.TourismSvcRepository;
import com.hp.services.TourismSvcService;

/**
 *
 * @author Joon
 */
@Service
@Transactional
public class TourismSvcServiceImpl implements TourismSvcService {

    @Autowired
    private TourismSvcRepository tourismSvcRepository;

    @Override
    public List<ListViewTourismSvcDTO> getTourismServices(Map<String, String> params) {
        return this.tourismSvcRepository.getTourismServices(params);
    }

    @Override
    public DetailTourismSvcDTO getTourismById(Integer id) {
        com.hp.pojo.Service svc = this.tourismSvcRepository.getTourismById(id);
        return this.toDetailTourismSvcDTO(svc);
    }

    private DetailTourismSvcDTO toDetailTourismSvcDTO(com.hp.pojo.Service svc) {
        if (svc == null)
            return null;

        DetailBaseServiceDTO baseInfo = new DetailBaseServiceDTO();
        baseInfo.setId(svc.getId());
        baseInfo.setName(svc.getName());
        baseInfo.setDescription(svc.getDescription());
        baseInfo.setPrice(svc.getPrice());
        Set<String> images = svc.getImageSet().stream().map(img -> img.getUrl()).collect(Collectors.toSet());
        baseInfo.setImages(images);
        DetailTourismSvcDTO detail = new DetailTourismSvcDTO();
        detail.setBaseInfo(baseInfo);
        detail.setId(svc.getServiceTourism().getId());
        detail.setStartDate(svc.getServiceTourism().getStartDate());
        detail.setEndDate(svc.getServiceTourism().getEndDate());
        detail.setLocation(svc.getServiceTourism().getLocation());
        return detail;
    }
}
