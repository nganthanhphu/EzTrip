/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import java.io.IOException;
import java.text.ParseException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.hp.dto.service.BaseServiceCreateDTO;
import com.hp.dto.service.TourismCreateDTO;
import com.hp.dto.service.TourismListViewDTO;
import com.hp.dto.service.TourismViewDTO;
import com.hp.pojo.BaseUser;
import com.hp.pojo.Image;
import com.hp.pojo.ProviderProfile;
import com.hp.pojo.ServiceTourism;
import com.hp.pojo.TypeOfService;
import com.hp.repositories.TourismSvcRepository;
import com.hp.repositories.UserRepository;
import com.hp.services.TourismSvcService;
import com.hp.utils.UserUtils;

/**
 *
 * @author Joon
 */
@Service
@Transactional
public class TourismSvcServiceImpl implements TourismSvcService {

    @Autowired
    private TourismSvcRepository tourismSvcRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public List<TourismListViewDTO> getTourismServices(Map<String, String> params) {
        return this.tourismSvcRepository.getTourismServices(params);
    }

    @Override
    public TourismViewDTO getTourismById(Integer id) {
        return this.tourismSvcRepository.getTourismById(id);
    }

    @Override
    public void addTourism(TourismCreateDTO tourism) throws ParseException {
        BaseServiceCreateDTO baseInfo = tourism.baseInfo();
        BaseUser currentUser = this.userRepository.getUserByPhone(UserUtils.getCurrentUserDetails().getUsername());
        com.hp.pojo.Service svc = new com.hp.pojo.Service();
        svc.setName(baseInfo.name());
        svc.setDescription(baseInfo.description());
        svc.setPrice(baseInfo.price());
        svc.setQuantity(baseInfo.quantity());
        svc.setIsActive(true);
        Set<Image> images = new HashSet<>();
        if (baseInfo.imgFiles() != null) {
            for (MultipartFile img : baseInfo.imgFiles()) {
                if (img.isEmpty())
                    continue;
                try {
                    Map<?, ?> res = this.cloudinary.uploader().upload(img.getBytes(),
                            ObjectUtils.asMap("resource_type", "auto"));
                    Image image = new Image();
                    image.setUrl(res.get("secure_url").toString());
                    image.setServiceId(svc);
                    images.add(image);
                } catch (IOException ex) {
                    Logger.getLogger(AccommodationSvcServiceImpl.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        svc.setImageSet(images);

        svc.setProviderId(new ProviderProfile(currentUser.getProviderProfile().getId()));
        svc.setTypeOfServiceId(new TypeOfService(1));

        ServiceTourism additionalInfo = new ServiceTourism();
        additionalInfo.setTourDuration(tourism.tourDuration());
        additionalInfo.setLocation(tourism.location());

        additionalInfo.setServiceId(svc);
        svc.setServiceTourism(additionalInfo);

        this.tourismSvcRepository.addOrUpdateTourism(svc);
    }
}
