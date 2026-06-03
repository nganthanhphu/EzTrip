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
import com.hp.services.ResourceAuthorizationService;
import com.hp.utils.UserUtils;

/**
 *
 * @author Joon
 */
@Service
@Transactional
public class ImageServiceImpl implements ImageService {

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ResourceAuthorizationService resourceAuthorizationService;

    @Override
    public void deleteImageById(Integer id) {
        if (!UserUtils.getCurrentUserDetails().getIsActive())
            throw new RuntimeException(
                    "Tài khoản của bạn không có quyền do chưa được kích hoạt. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.");

        Image image = this.resourceAuthorizationService.getImageForUpdate(id);
        this.imageRepository.deleteImage(image);
    }
}
