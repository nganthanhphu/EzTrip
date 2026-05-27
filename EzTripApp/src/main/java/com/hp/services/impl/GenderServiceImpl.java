/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hp.pojo.Gender;
import com.hp.repositories.GenderRepository;
import com.hp.services.GenderService;

/**
 *
 * @author Joon
 */
@Service
@Transactional
public class GenderServiceImpl implements GenderService{
    
    @Autowired
    private GenderRepository genderRepository;

    @Override
    public List<Gender> getGenders() {
        return this.genderRepository.getGenders();
    }

}
