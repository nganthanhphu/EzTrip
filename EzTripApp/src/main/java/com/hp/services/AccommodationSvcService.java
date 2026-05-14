/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services;

import java.util.List;
import java.util.Map;

import com.hp.dto.service.DetailAccommodationSvcDTO;
import com.hp.dto.service.ListViewAccommodationSvcDTO;

/**
 *
 * @author Joon
 */
public interface AccommodationSvcService {
    List<ListViewAccommodationSvcDTO> getAccommodationServices(Map<String, String> params);

    DetailAccommodationSvcDTO getAccommodationById(Integer id);
}
