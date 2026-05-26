/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

import com.hp.dto.service.TourismSvcDetailDTO;
import com.hp.dto.service.TourismSvcListDTO;

/**
 *
 * @author Joon
 */
public interface TourismSvcService {
    List<TourismSvcListDTO> getTourismServices(Map<String, String> params);

    TourismSvcDetailDTO getTourismById(Integer id);
    
    void addTourism(TourismSvcDetailDTO tourism) throws ParseException;
}
