/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.controllers;

import java.text.ParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

import com.hp.dto.service.AccommodationCreateDTO;
import com.hp.dto.service.AccommodationListViewDTO;
import com.hp.dto.service.AccommodationUpdateDTO;
import com.hp.dto.service.AccommodationViewDTO;
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
    public ResponseEntity<List<AccommodationListViewDTO>> getAccommodations(
            @RequestParam Map<String, String> params) {
        List<AccommodationListViewDTO> accommodations = this.accommodationService.getAccommodationServices(params);
        return new ResponseEntity<>(accommodations, HttpStatus.OK);
    }

    @GetMapping("/accommodations/{id}")
    public ResponseEntity<AccommodationViewDTO> getAccommodationById(@PathVariable(value = "id") int id) {
        AccommodationViewDTO accommodation = this.accommodationService.getAccommodationById(id);

        if (accommodation != null) {
            return new ResponseEntity<>(accommodation, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasRole('PROVIDER') and principal.providerType == 'ACCOMMODATION'")
    @PostMapping(path = "/secure/accommodations", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public void addAccommodation(@ModelAttribute AccommodationCreateDTO accommodation) throws ParseException {
        this.accommodationService.addAccommodation(accommodation);
    }

    @PreAuthorize("hasRole('PROVIDER') and principal.providerType == 'ACCOMMODATION'")
    @PatchMapping(path = "/secure/accommodations/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateAccommodation(@PathVariable(value = "id") int id,
            @ModelAttribute AccommodationUpdateDTO accommodation) throws ParseException {
        this.accommodationService.updateAccommodation(id, accommodation);
    }

    @PreAuthorize("hasRole('PROVIDER') and principal.providerType == 'ACCOMMODATION'")
    @DeleteMapping("/secure/accommodations/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAccommodation(@PathVariable(value = "id") int id) {
        this.accommodationService.deleteAccommodation(id);
    }

    @GetMapping("/accommodations/compare")
    public ResponseEntity<Map<String, String>> compareAccommodationServices(
            @RequestParam(value = "svcId1") Integer svcId1,
            @RequestParam(value = "svcId2") Integer svcId2,
            @RequestParam(value = "svcId3", required = false) Integer svcId3) {
        String result = this.accommodationService.compareAccommodationServices(svcId1, svcId2, svcId3);
        Map<String, String> response = new HashMap<>();
        response.put("result", result);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
