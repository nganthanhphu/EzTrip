/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hp.pojo.Image;
import com.hp.repositories.ImageRepository;
import com.hp.services.ImageService;

/**
 *
 * @author Joon
 */
@Service
@Transactional
public class ImageServiceImpl implements ImageService{
    
    @Autowired
    private ImageRepository imageRepository;

    @Override
    public void deleteImageById(Integer id) {
        Image image = this.imageRepository.getImageById(id);
        if (image != null) {
            this.imageRepository.deleteImage(image);
        }
    }
}
