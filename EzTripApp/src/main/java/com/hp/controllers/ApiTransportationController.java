/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.controllers;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.hp.dto.service.TransportationCreateDTO;
import com.hp.dto.service.TransportationListViewDTO;
import com.hp.dto.service.TransportationUpdateDTO;
import com.hp.dto.service.TransportationViewDTO;
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
    public ResponseEntity<List<TransportationListViewDTO>> getTransportations(
            @RequestParam Map<String, String> params) {
        List<TransportationListViewDTO> transportations = this.transportationService
                .getTransportationServices(params);
        return new ResponseEntity<>(transportations, HttpStatus.OK);
    }

    @GetMapping("/transportations/{id}")
    public ResponseEntity<TransportationViewDTO> getTransportationById(@PathVariable(value = "id") int id) {
        TransportationViewDTO transportation = this.transportationService.getTransportationById(id);

        if (transportation != null) {
            return new ResponseEntity<>(transportation, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(path = "/secure/transportations", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public void addTransportation(@ModelAttribute TransportationCreateDTO transportation) throws ParseException {
        this.transportationService.addTransportation(transportation);
    }

    @PatchMapping(path = "/secure/transportations/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateTransportation(@PathVariable(value = "id") int id,
            @ModelAttribute TransportationUpdateDTO transportation) throws ParseException {
        this.transportationService.updateTransportation(id, transportation);
    }

    @DeleteMapping("/secure/transportations/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTransportation(@PathVariable(value = "id") int id) {
        this.transportationService.deleteTransportation(id);
    }

}
