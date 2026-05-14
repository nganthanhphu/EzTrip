/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories;

import java.util.List;
import java.util.Map;

import com.hp.dto.service.ListViewTourismSvcDTO;
import com.hp.pojo.Service;

/**
 *
 * @author Joon
 */
public interface TourismSvcRepository {

    List<ListViewTourismSvcDTO> getTourismServices(Map<String, String> params);

    Service getTourismById(Integer id);
}
