/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.hp.dto.service.AccommodationSvcDetailDTO;
import com.hp.dto.service.BaseServiceDetailDTO;
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
        com.hp.pojo.Service svc = this.accommodationSvcRepository.getAccommodationById(id);
        return this.toDetailAccommodationSvcDTO(svc);
    }

    private AccommodationSvcDetailDTO toDetailAccommodationSvcDTO(com.hp.pojo.Service svc) {
        if (svc == null)
            return null;

        BaseServiceDetailDTO baseInfo = new BaseServiceDetailDTO();
        baseInfo.setId(svc.getId());
        baseInfo.setName(svc.getName());
        baseInfo.setDescription(svc.getDescription());
        baseInfo.setPrice(svc.getPrice());
        baseInfo.setQuantity(svc.getQuantity());
        Set<String> images = svc.getImageSet().stream().map(img -> img.getUrl()).collect(Collectors.toSet());
        baseInfo.setImages(images);
        AccommodationSvcDetailDTO detail = new AccommodationSvcDetailDTO();
        detail.setBaseInfo(baseInfo);
        detail.setId(svc.getServiceAccommodation().getId());
        detail.setCheckInDate(svc.getServiceAccommodation().getCheckInDate());
        detail.setCheckOutDate(svc.getServiceAccommodation().getCheckOutDate());
        detail.setQuantityOfBed(svc.getServiceAccommodation().getQuantityOfBed());
        detail.setArea(svc.getServiceAccommodation().getArea());
        detail.setLocation(svc.getServiceAccommodation().getLocation());
        return detail;
    }

    @Override
    public AccommodationSvcDetailDTO addAccommodation(AccommodationSvcDetailDTO accommodation) throws ParseException {
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

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String checkInDt = accommodation.getCheckInDt();
        String checkOutDt = accommodation.getCheckOutDt();
        Date checkInDate = sdf.parse(checkInDt);
        Date checkOutDate = sdf.parse(checkOutDt);
        additionalInfo.setCheckInDate(checkInDate);
        additionalInfo.setCheckOutDate(checkOutDate);

        additionalInfo.setQuantityOfBed(accommodation.getQuantityOfBed());
        additionalInfo.setArea(accommodation.getArea());
        additionalInfo.setLocation(accommodation.getLocation());

        additionalInfo.setServiceId(svc);
        svc.setServiceAccommodation(additionalInfo);
        
        com.hp.pojo.Service addedSvc = this.accommodationSvcRepository.addOrUpdateAccommodation(svc);

        return this.toDetailAccommodationSvcDTO(addedSvc);
    }
}
