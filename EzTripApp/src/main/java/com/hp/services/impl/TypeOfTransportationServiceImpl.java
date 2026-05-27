/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hp.pojo.TypeOfTransportation;
import com.hp.repositories.TypeOfTransportationRepository;
import com.hp.services.TypeOfTransportationService;

/**
 *
 * @author Joon
 */
@Service
@Transactional
public class TypeOfTransportationServiceImpl implements TypeOfTransportationService{

    @Autowired
    private TypeOfTransportationRepository typeOfTransportationRepository;

    @Override
    public List<TypeOfTransportation> getTypeOfTransportations() {
        return this.typeOfTransportationRepository.getTypeOfTransportations();
    }
    
}
