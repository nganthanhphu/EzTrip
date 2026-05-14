/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services;

import java.util.List;
import java.util.Map;

import com.hp.dto.service.DetailTourismSvcDTO;
import com.hp.dto.service.ListViewTourismSvcDTO;

/**
 *
 * @author Joon
 */
public interface TourismSvcService {
    List<ListViewTourismSvcDTO> getTourismServices(Map<String, String> params);

    DetailTourismSvcDTO getTourismById(Integer id);
}
