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

import com.hp.pojo.Gender;
import com.hp.services.GenderService;

/**
 *
 * @author Joon
 */
@Controller
@RequestMapping("/api")
public class ApiGenderController {

    @Autowired
    private GenderService genderService;

    @GetMapping("/genders")
    public ResponseEntity<List<Gender>> getGenders() {
        List<Gender> genders = this.genderService.getGenders();
        return new ResponseEntity<>(genders, HttpStatus.OK);
    }
}