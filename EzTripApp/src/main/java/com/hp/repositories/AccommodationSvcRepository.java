/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories;

import java.util.List;
import java.util.Map;

import com.hp.dto.service.AccommodationListViewDTO;
import com.hp.dto.service.AccommodationViewDTO;

/**
 *
 * @author Joon
 */
public interface AccommodationSvcRepository {

    List<AccommodationListViewDTO> getAccommodationServices(Map<String, String> params);

    AccommodationViewDTO getAccommodationById(Integer id);

}
