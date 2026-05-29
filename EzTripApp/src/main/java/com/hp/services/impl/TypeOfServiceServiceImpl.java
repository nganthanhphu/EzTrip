/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hp.pojo.TypeOfService;
import com.hp.repositories.TypeOfServiceRepository;
import com.hp.services.TypeOfServiceService;

/**
 *
 * @author Joon
 */
@Service
@Transactional
public class TypeOfServiceServiceImpl implements TypeOfServiceService{

    @Autowired
    private TypeOfServiceRepository typeOfServiceRepository;

    @Override
    public List<TypeOfService> getTypeOfServices() {
        return this.typeOfServiceRepository.getTypeOfServices();
    }
    
}
