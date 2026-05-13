/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hp.dto.service.ListViewTourismSvcDTO;
import com.hp.repositories.TourismSvcRepository;
import com.hp.services.TourismSvcService;

/**
 *
 * @author Joon
 */
@Service
public class TourismSvcServiceImpl implements TourismSvcService{

    @Autowired
    private TourismSvcRepository tourismSvcRepository;
    
    @Override
    public List<ListViewTourismSvcDTO> getTourismServices(Map<String, String> params) {
        return this.tourismSvcRepository.getTourismServices(params);
    }
}
