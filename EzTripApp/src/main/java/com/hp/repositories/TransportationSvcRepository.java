/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories;

import java.util.List;
import java.util.Map;

import com.hp.dto.service.TransportationSvcDetailDTO;
import com.hp.dto.service.TransportationSvcListDTO;
import com.hp.pojo.Service;

/**
 *
 * @author Joon
 */
public interface TransportationSvcRepository {

    List<TransportationSvcListDTO> getTransportationServices(Map<String, String> params);

    TransportationSvcDetailDTO getTransportationById(Integer id);

    void addOrUpdateTransportation(Service svc);
}
