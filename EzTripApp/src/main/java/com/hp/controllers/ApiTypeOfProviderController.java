/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.hp.pojo.TypeOfProvider;
import com.hp.services.TypeOfProviderService;

/**
 *
 * @author Joon
 */
@Controller
@RequestMapping("/api")
public class ApiTypeOfProviderController {
    
    @Autowired
    private TypeOfProviderService typeOfProviderService;

    @GetMapping("/type-of-providers")
    public ResponseEntity<List<TypeOfProvider>> getTypeOfProviders() {
        List<TypeOfProvider> typeOfProviders = this.typeOfProviderService.getTypeOfProviders();
        return new ResponseEntity<>(typeOfProviders, HttpStatus.OK);
    }

}
