/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hp.dto.service.ListViewAccommodationSvcDTO;
import com.hp.repositories.AccommodationSvcRepository;
import com.hp.services.AccommodationSvcService;

/**
 *
 * @author Joon
 */
@Service
public class AccommodationSvcServiceImpl implements AccommodationSvcService{

    @Autowired
    private AccommodationSvcRepository accommodationSvcRepository;

    @Override
    public List<ListViewAccommodationSvcDTO> getAccommodationServices(Map<String, String> params) {
        return this.accommodationSvcRepository.getAccommodationServices(params);
    }
    
}
