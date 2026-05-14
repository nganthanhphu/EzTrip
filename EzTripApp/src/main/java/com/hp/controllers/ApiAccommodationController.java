/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.hp.dto.service.DetailAccommodationSvcDTO;
import com.hp.dto.service.ListViewAccommodationSvcDTO;
import com.hp.services.AccommodationSvcService;

/**
 *
 * @author Joon
 */
@Controller
@RequestMapping("/api")
public class ApiAccommodationController {

    @Autowired
    private AccommodationSvcService accommodationService;

    @GetMapping("/accommodations")
    public ResponseEntity<List<ListViewAccommodationSvcDTO>> getAccommodations(
            @RequestParam Map<String, String> params) {
        List<ListViewAccommodationSvcDTO> accommodations = this.accommodationService.getAccommodationServices(params);
        return new ResponseEntity<>(accommodations, HttpStatus.OK);
    }

    @GetMapping("/accommodations/{id}")
    public ResponseEntity<DetailAccommodationSvcDTO> getAccommodationById(@PathVariable(value = "id") int id) {
        DetailAccommodationSvcDTO accommodation = this.accommodationService.getAccommodationById(id);
        return new ResponseEntity<>(accommodation, HttpStatus.OK);
    }
}
