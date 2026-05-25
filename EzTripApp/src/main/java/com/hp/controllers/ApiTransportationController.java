/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.hp.dto.service.TransportationSvcDetailDTO;
import com.hp.dto.service.TransportationSvcListDTO;
import com.hp.services.TransportationSvcService;

/**
 *
 * @author Joon
 */
@Controller
@RequestMapping("/api")
public class ApiTransportationController {

    @Autowired
    private TransportationSvcService transportationService;

    @GetMapping("/transportations")
    public ResponseEntity<List<TransportationSvcListDTO>> getTransportations(
            @RequestParam Map<String, String> params) {
        List<TransportationSvcListDTO> transportations = this.transportationService
                .getTransportationServices(params);
        return new ResponseEntity<>(transportations, HttpStatus.OK);
    }

    @GetMapping("/transportations/{id}")
    public ResponseEntity<TransportationSvcDetailDTO> getTransportationById(@PathVariable(value = "id") int id) {
        TransportationSvcDetailDTO transportation = this.transportationService.getTransportationById(id);

        if (transportation != null) {
            return new ResponseEntity<>(transportation, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(path = "/secure/transportations", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TransportationSvcDetailDTO> addTransportation(
            @ModelAttribute TransportationSvcDetailDTO transportation) throws Exception {
        TransportationSvcDetailDTO addedTransportation = this.transportationService.addTransportation(transportation);
        return new ResponseEntity<>(addedTransportation, HttpStatus.CREATED);
    }
}
