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

import com.hp.dto.service.TourismSvcDetailDTO;
import com.hp.dto.service.TourismSvcListDTO;
import com.hp.services.TourismSvcService;

/**
 *
 * @author Joon
 */
@Controller
@RequestMapping("/api")
public class ApiTourismController {

    @Autowired
    private TourismSvcService tourismService;

    @GetMapping("/tourisms")
    public ResponseEntity<List<TourismSvcListDTO>> getTourisms(@RequestParam Map<String, String> params) {
        List<TourismSvcListDTO> tourisms = this.tourismService.getTourismServices(params);
        return new ResponseEntity<>(tourisms, HttpStatus.OK);
    }

    @GetMapping("/tourisms/{id}")
    public ResponseEntity<TourismSvcDetailDTO> getTourismById(@PathVariable(value = "id") int id) {
        TourismSvcDetailDTO tourism = this.tourismService.getTourismById(id);
        
        if (tourism != null) {
            return new ResponseEntity<>(tourism, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(path = "/secure/tourisms", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TourismSvcDetailDTO> addTourism(@ModelAttribute TourismSvcDetailDTO tourism) throws Exception {
        TourismSvcDetailDTO addedTourism = this.tourismService.addTourism(tourism);
        return new ResponseEntity<>(addedTourism, HttpStatus.CREATED);
    }
}
