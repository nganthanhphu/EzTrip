/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

import com.hp.dto.service.TransportationSvcDetailDTO;
import com.hp.dto.service.TransportationSvcListDTO;

/**
 *
 * @author Joon
 */
public interface TransportationSvcService {
    List<TransportationSvcListDTO> getTransportationServices(Map<String, String> params);

    TransportationSvcDetailDTO getTransportationById(Integer id);

    void addTransportation(TransportationSvcDetailDTO transportation) throws ParseException;
}
