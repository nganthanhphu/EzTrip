/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hp.pojo.TypeOfProvider;
import com.hp.repositories.TypeOfProviderRepository;
import com.hp.services.TypeOfProviderService;

/**
 *
 * @author Joon
 */
@Service
@Transactional
public class TypeOfProviderServiceImpl implements TypeOfProviderService{
    
    @Autowired
    private TypeOfProviderRepository typeOfProviderRepository;

     @Override
     public List<TypeOfProvider> getTypeOfProviders() {
        return this.typeOfProviderRepository.getTypeOfProviders();
     }

}
