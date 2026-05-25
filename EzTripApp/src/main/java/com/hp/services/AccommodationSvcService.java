/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services;

import java.util.List;
import java.util.Map;

import com.hp.dto.service.AccommodationSvcDetailDTO;
import com.hp.dto.service.AccommodationSvcListDTO;

/**
 *
 * @author Joon
 */
public interface AccommodationSvcService {
    List<AccommodationSvcListDTO> getAccommodationServices(Map<String, String> params);

    AccommodationSvcDetailDTO getAccommodationById(Integer id);

    AccommodationSvcDetailDTO addAccommodation(AccommodationSvcDetailDTO accommodation) throws Exception;
}
