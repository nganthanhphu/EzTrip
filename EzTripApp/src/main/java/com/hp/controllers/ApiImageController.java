/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.hp.services.ImageService;
import org.springframework.http.HttpStatus;

/**
 *
 * @author Joon
 */
@Controller
@RequestMapping("/api")
public class ApiImageController {
    
    @Autowired
    private ImageService imageService;

    @DeleteMapping("/secure/images/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteImage(@PathVariable(value = "id") int id) {
        this.imageService.deleteImageById(id);
    }
}
