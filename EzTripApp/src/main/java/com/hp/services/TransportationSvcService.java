/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

import com.hp.dto.service.TransportationCreateDTO;
import com.hp.dto.service.TransportationListViewDTO;
import com.hp.dto.service.TransportationUpdateDTO;
import com.hp.dto.service.TransportationViewDTO;

/**
 *
 * @author Joon
 */
public interface TransportationSvcService {
    List<TransportationListViewDTO> getTransportationServices(Map<String, String> params);

    TransportationViewDTO getTransportationById(Integer id);

    void addTransportation(TransportationCreateDTO transportation) throws ParseException;

    void updateTransportation(Integer id, TransportationUpdateDTO transportation) throws ParseException;

    void deleteTransportation(Integer id);
}
