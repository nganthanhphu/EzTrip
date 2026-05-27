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

import com.hp.pojo.TypeOfTransportation;
import com.hp.services.TypeOfTransportationService;

/**
 *
 * @author Joon
 */
@Controller
@RequestMapping("/api")
public class ApiTypeOfTransportationController {

    @Autowired
    private TypeOfTransportationService typeOfTransportationService;

    @GetMapping("/type-of-transportations")
    public ResponseEntity<List<TypeOfTransportation>> getTypeOfTransportations() {
        List<TypeOfTransportation> typeOfTransportations = this.typeOfTransportationService.getTypeOfTransportations();
        return new ResponseEntity<>(typeOfTransportations, HttpStatus.OK);
    }
    
}
