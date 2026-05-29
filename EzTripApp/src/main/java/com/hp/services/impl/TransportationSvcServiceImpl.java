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
import com.hp.dto.service.BaseServiceUpdateDTO;
import com.hp.dto.service.TransportationCreateDTO;
import com.hp.dto.service.TransportationListViewDTO;
import com.hp.dto.service.TransportationUpdateDTO;
import com.hp.dto.service.TransportationViewDTO;
import com.hp.pojo.Image;
import com.hp.pojo.ProviderProfile;
import com.hp.pojo.ServiceTransportation;
import com.hp.pojo.TypeOfService;
import com.hp.pojo.TypeOfTransportation;
import com.hp.repositories.BaseServiceRepository;
import com.hp.repositories.TransportationSvcRepository;
import com.hp.security.MyUserDetails;
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
    private BaseServiceRepository baseServiceRepository;

    @Autowired
    private Cloudinary cloudinary;

    public List<TransportationListViewDTO> getTransportationServices(Map<String, String> params) {
        int providerId = 0;

        MyUserDetails userDetails = UserUtils.getCurrentUserDetails();

        if (userDetails != null) {
            if (userDetails.getAuthorities().stream().findFirst().get().getAuthority().equals("ROLE_PROVIDER")) {
                if (userDetails.getProviderId() != null)
                    providerId = userDetails.getProviderId();
            }
        }

        return this.transportationSvcRepository.getTransportationServices(params, providerId);
    }

    @Override
    public TransportationViewDTO getTransportationById(Integer id) {
        return this.transportationSvcRepository.getTransportationById(id);
    }

    @Override
    public void addTransportation(TransportationCreateDTO transportation) throws ParseException {
        BaseServiceCreateDTO baseInfo = transportation.baseInfo();
        Integer providerId = UserUtils.getCurrentUserDetails().getProviderId();
        com.hp.pojo.Service svc = new com.hp.pojo.Service();
        svc.setName(baseInfo.name());
        svc.setDescription(baseInfo.description());
        svc.setPrice(baseInfo.price());
        svc.setQuantity(baseInfo.quantity());
        svc.setIsActive(true);

        svc.setProviderId(new ProviderProfile(providerId));
        svc.setTypeOfServiceId(new TypeOfService(3));

        ServiceTransportation additionalInfo = new ServiceTransportation();
        additionalInfo.setArrivalLocation(transportation.arrivalLocation());
        additionalInfo.setDepartureLocation(transportation.departureLocation());
        additionalInfo.setArrivalTime(transportation.arrivalTime());
        additionalInfo.setDepartureTime(transportation.departureTime());

        Integer typeOfTransportationId = transportation.typeOfTransportation();
        additionalInfo.setTypeOfTransportationId(new TypeOfTransportation(typeOfTransportationId));

        additionalInfo.setServiceId(svc);
        svc.setServiceTransportation(additionalInfo);

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

        this.baseServiceRepository.addOrUpdateService(svc);
    }

    @Override
    public void updateTransportation(Integer id, TransportationUpdateDTO transportation) throws ParseException {
        com.hp.pojo.Service svc = this.baseServiceRepository.getServiceById(id);

        if (svc == null)
            throw new IllegalArgumentException("Dịch vụ không tồn tại!");

        BaseServiceUpdateDTO baseInfo = transportation.baseInfo();

        if (baseInfo.name() != null && !baseInfo.name().isEmpty())
            svc.setName(baseInfo.name());

        if (baseInfo.description() != null && !baseInfo.description().isEmpty())
            svc.setDescription(baseInfo.description());

        if (baseInfo.price() != null)
            svc.setPrice(baseInfo.price());

        if (baseInfo.quantity() != null)
            svc.setQuantity(baseInfo.quantity());

        ServiceTransportation additionalInfo = svc.getServiceTransportation();

        if (transportation.arrivalLocation() != null && !transportation.arrivalLocation().isEmpty())
            additionalInfo.setArrivalLocation(transportation.arrivalLocation());

        if (transportation.departureLocation() != null && !transportation.departureLocation().isEmpty())
            additionalInfo.setDepartureLocation(transportation.departureLocation());

        if (transportation.arrivalTime() != null)
            additionalInfo.setArrivalTime(transportation.arrivalTime());

        if (transportation.departureTime() != null)
            additionalInfo.setDepartureTime(transportation.departureTime());

        if (transportation.typeOfTransportation() != null)
            additionalInfo.setTypeOfTransportationId(new TypeOfTransportation(transportation.typeOfTransportation()));

        Set<Image> images = svc.getImageSet();

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
        svc.setServiceTransportation(additionalInfo);
        this.baseServiceRepository.addOrUpdateService(svc);
    }

}
