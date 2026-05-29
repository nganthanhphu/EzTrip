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

import com.hp.pojo.TypeOfService;
import com.hp.services.TypeOfServiceService;

/**
 *
 * @author Joon
 */
@Controller
@RequestMapping("/api")
public class ApiTypeOfServiceController {

    @Autowired
    private TypeOfServiceService typeOfServiceService;

    @GetMapping("/type-of-services")
    public ResponseEntity<List<TypeOfService>> getTypeOfServices() {
        List<TypeOfService> typeOfServices = this.typeOfServiceService.getTypeOfServices();
        return new ResponseEntity<>(typeOfServices, HttpStatus.OK);
    }
}
