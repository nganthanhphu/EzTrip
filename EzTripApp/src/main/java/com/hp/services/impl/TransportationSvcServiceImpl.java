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
import com.hp.dto.service.DetailTransportationSvcDTO;
import com.hp.dto.service.ListViewTransportationSvcDTO;
import com.hp.repositories.TransportationSvcRepository;
import com.hp.services.TransportationSvcService;

/**
 *
 * @author Joon
 */
@Service
@Transactional
public class TransportationSvcServiceImpl implements TransportationSvcService {

    @Autowired
    private TransportationSvcRepository transportationSvcRepository;

    public List<ListViewTransportationSvcDTO> getTransportationServices(Map<String, String> params) {
        return this.transportationSvcRepository.getTransportationServices(params);
    }

    @Override
    public DetailTransportationSvcDTO getTransportationById(Integer id) {
        com.hp.pojo.Service svc = this.transportationSvcRepository.getTransportationById(id);
        return this.toDetailTransportationSvcDTO(svc);
    }

    private DetailTransportationSvcDTO toDetailTransportationSvcDTO(com.hp.pojo.Service svc) {
        if (svc == null)
            return null;
        DetailBaseServiceDTO baseInfo = new DetailBaseServiceDTO();
        baseInfo.setId(svc.getId());
        baseInfo.setName(svc.getName());
        baseInfo.setDescription(svc.getDescription());
        baseInfo.setPrice(svc.getPrice());
        Set<String> images = svc.getImageSet().stream().map(img -> img.getUrl()).collect(Collectors.toSet());
        baseInfo.setImages(images);
        DetailTransportationSvcDTO detail = new DetailTransportationSvcDTO();
        detail.setBaseInfo(baseInfo);
        detail.setId(svc.getServiceTransportation().getId());
        detail.setArrivalLocation(svc.getServiceTransportation().getArrivalLocation());
        detail.setDepartureLocation(svc.getServiceTransportation().getDepartureLocation());
        detail.setArrivalTime(svc.getServiceTransportation().getArrivalTime());
        detail.setDepartureTime(svc.getServiceTransportation().getDepartureTime());
        detail.setTypeOfTransportation(svc.getServiceTransportation().getTypeOfTransportationId().getName());
        return detail;
    }
}
