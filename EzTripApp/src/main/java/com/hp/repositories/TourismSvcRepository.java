/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories;

import java.util.List;
import java.util.Map;

import com.hp.dto.service.TourismSvcDetailDTO;
import com.hp.dto.service.TourismSvcListDTO;
import com.hp.pojo.Service;

/**
 *
 * @author Joon
 */
public interface TourismSvcRepository {

    List<TourismSvcListDTO> getTourismServices(Map<String, String> params);

    TourismSvcDetailDTO getTourismById(Integer id);

    void addOrUpdateTourism(Service svc);
}
