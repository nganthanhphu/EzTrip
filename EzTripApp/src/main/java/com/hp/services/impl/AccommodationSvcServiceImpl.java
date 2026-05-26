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
import com.hp.dto.service.AccommodationSvcDetailDTO;
import com.hp.dto.service.AccommodationSvcListDTO;
import com.hp.pojo.BaseUser;
import com.hp.pojo.Image;
import com.hp.pojo.ProviderProfile;
import com.hp.pojo.ServiceAccommodation;
import com.hp.pojo.TypeOfService;
import com.hp.repositories.AccommodationSvcRepository;
import com.hp.repositories.UserRepository;
import com.hp.services.AccommodationSvcService;
import com.hp.utils.UserUtils;

/**
 *
 * @author Joon
 */
@Service
@Transactional
public class AccommodationSvcServiceImpl implements AccommodationSvcService {

    @Autowired
    private AccommodationSvcRepository accommodationSvcRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public List<AccommodationSvcListDTO> getAccommodationServices(Map<String, String> params) {
        return this.accommodationSvcRepository.getAccommodationServices(params);
    }

    @Override
    public AccommodationSvcDetailDTO getAccommodationById(Integer id) {
        return this.accommodationSvcRepository.getAccommodationById(id);
    }

    @Override
    public void addAccommodation(AccommodationSvcDetailDTO accommodation) throws ParseException {
        BaseUser currentUser = this.userRepository.getUserByPhone(UserUtils.getCurrentUserDetails().getUsername());
        com.hp.pojo.Service svc = new com.hp.pojo.Service();
        svc.setName(accommodation.getBaseInfo().getName());
        svc.setDescription(accommodation.getBaseInfo().getDescription());
        svc.setPrice(accommodation.getBaseInfo().getPrice());
        svc.setQuantity(accommodation.getBaseInfo().getQuantity());
        svc.setIsActive(true);
        Set<Image> images = new HashSet<>();
        for (MultipartFile img : accommodation.getBaseInfo().getImgFiles()) {
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
        svc.setImageSet(images);

        svc.setProviderId(new ProviderProfile(currentUser.getProviderProfile().getId()));
        svc.setTypeOfServiceId(new TypeOfService(2));

        ServiceAccommodation additionalInfo = new ServiceAccommodation();

        additionalInfo.setQuantityOfBed(accommodation.getQuantityOfBed());
        additionalInfo.setArea(accommodation.getArea());
        additionalInfo.setLocation(accommodation.getLocation());

        additionalInfo.setServiceId(svc);
        svc.setServiceAccommodation(additionalInfo);
        
        this.accommodationSvcRepository.addOrUpdateAccommodation(svc);
    }
}
