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
import com.hp.dto.service.TransportationCreateDTO;
import com.hp.dto.service.TransportationListViewDTO;
import com.hp.dto.service.TransportationViewDTO;
import com.hp.pojo.BaseUser;
import com.hp.pojo.Image;
import com.hp.pojo.ProviderProfile;
import com.hp.pojo.ServiceTransportation;
import com.hp.pojo.TypeOfService;
import com.hp.pojo.TypeOfTransportation;
import com.hp.repositories.TransportationSvcRepository;
import com.hp.repositories.TypeOfTransportationRepository;
import com.hp.repositories.UserRepository;
import com.hp.services.TransportationSvcService;
import com.hp.utils.UserUtils;

/**
 *
 * @author Joon
 */
@Service
@Transactional
public class TransportationSvcServiceImpl implements TransportationSvcService {

    @Autowired
    private TransportationSvcRepository transportationSvcRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private TypeOfTransportationRepository typeOfTransportationRepository;

    public List<TransportationListViewDTO> getTransportationServices(Map<String, String> params) {
        return this.transportationSvcRepository.getTransportationServices(params);
    }

    @Override
    public TransportationViewDTO getTransportationById(Integer id) {
        return this.transportationSvcRepository.getTransportationById(id);
    }

    @Override
    public void addTransportation(TransportationCreateDTO transportation) throws ParseException {
        TypeOfTransportation typeOfTransportation = this.typeOfTransportationRepository
                .getTypeOfTransportationByName(transportation.typeOfTransportation());
        if (typeOfTransportation == null) {
            throw new IllegalArgumentException("Loại phương tiện không hợp lệ!");
        }

        BaseServiceCreateDTO baseInfo = transportation.baseInfo();
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
        svc.setTypeOfServiceId(new TypeOfService(3));

        ServiceTransportation additionalInfo = new ServiceTransportation();
        additionalInfo.setArrivalLocation(transportation.arrivalLocation());
        additionalInfo.setDepartureLocation(transportation.departureLocation());
        additionalInfo.setArrivalTime(transportation.arrivalTime());
        additionalInfo.setDepartureTime(transportation.departureTime());
        additionalInfo.setTypeOfTransportationId(typeOfTransportation);

        additionalInfo.setServiceId(svc);
        svc.setServiceTransportation(additionalInfo);

        this.transportationSvcRepository.addOrUpdateTransportation(svc);
    }
}
