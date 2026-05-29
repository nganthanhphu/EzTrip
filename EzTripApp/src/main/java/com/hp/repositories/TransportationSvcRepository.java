/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories;

import java.util.List;
import java.util.Map;

import com.hp.dto.service.TransportationListViewDTO;
import com.hp.dto.service.TransportationViewDTO;

/**
 *
 * @author Joon
 */
public interface TransportationSvcRepository {

    List<TransportationListViewDTO> getTransportationServices(Map<String, String> params, int providerId);

    TransportationViewDTO getTransportationById(Integer id);

}
