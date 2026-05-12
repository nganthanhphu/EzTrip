/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hp.dto.service.ListTransportationSvcDTO;
import com.hp.repositories.TransportationSvcRepository;
import com.hp.services.TransportationSvcService;

/**
 *
 * @author Joon
 */
@Service
public class TransportationSvcServiceImpl implements TransportationSvcService{

    @Autowired
    private TransportationSvcRepository transportationSvcRepository;
    
    public List<ListTransportationSvcDTO> getTransportationServices(Map<String, String> params) {
        return this.transportationSvcRepository.getTransportationServices(params);
    }
}
