/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

import com.hp.dto.service.TourismCreateDTO;
import com.hp.dto.service.TourismListViewDTO;
import com.hp.dto.service.TourismUpdateDTO;
import com.hp.dto.service.TourismViewDTO;

/**
 *
 * @author Joon
 */
public interface TourismSvcService {
    List<TourismListViewDTO> getTourismServices(Map<String, String> params);

    TourismViewDTO getTourismById(Integer id);

    void addTourism(TourismCreateDTO tourism) throws ParseException;

    void updateTourism(Integer id, TourismUpdateDTO tourism) throws ParseException;

    void deleteTourism(Integer id);

    String compareTourismServices(Integer svcId1, Integer svcId2, Integer svcId3);

}
