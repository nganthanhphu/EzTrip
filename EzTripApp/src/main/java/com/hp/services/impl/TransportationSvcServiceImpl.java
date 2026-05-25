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
import com.hp.dto.service.BaseServiceDetailDTO;
import com.hp.dto.service.TransportationSvcDetailDTO;
import com.hp.dto.service.TransportationSvcListDTO;
import com.hp.dto.user.UserProfileDTO;
import com.hp.pojo.Image;
import com.hp.pojo.ProviderProfile;
import com.hp.pojo.ServiceTransportation;
import com.hp.pojo.TypeOfService;
import com.hp.pojo.TypeOfTransportation;
import com.hp.repositories.TransportationSvcRepository;
import com.hp.repositories.TypeOfTransportationRepository;
import com.hp.services.TransportationSvcService;
import com.hp.services.UserService;
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
    private UserService userService;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private TypeOfTransportationRepository typeOfTransportationRepository;

    public List<TransportationSvcListDTO> getTransportationServices(Map<String, String> params) {
        return this.transportationSvcRepository.getTransportationServices(params);
    }

    @Override
    public TransportationSvcDetailDTO getTransportationById(Integer id) {
        com.hp.pojo.Service svc = this.transportationSvcRepository.getTransportationById(id);
        return this.toDetailTransportationSvcDTO(svc);
    }

    private TransportationSvcDetailDTO toDetailTransportationSvcDTO(com.hp.pojo.Service svc) {
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
        TransportationSvcDetailDTO detail = new TransportationSvcDetailDTO();
        detail.setBaseInfo(baseInfo);
        detail.setId(svc.getServiceTransportation().getId());
        detail.setArrivalLocation(svc.getServiceTransportation().getArrivalLocation());
        detail.setDepartureLocation(svc.getServiceTransportation().getDepartureLocation());
        detail.setArrivalTime(svc.getServiceTransportation().getArrivalTime());
        detail.setDepartureTime(svc.getServiceTransportation().getDepartureTime());
        detail.setTypeOfTransportation(svc.getServiceTransportation().getTypeOfTransportationId().getName());
        return detail;
    }

    @Override
    public TransportationSvcDetailDTO addTransportation(TransportationSvcDetailDTO transportation) throws ParseException {
        TypeOfTransportation typeOfTransportation = this.typeOfTransportationRepository
                .getTypeOfTransportationByName(transportation.getTypeOfTransportation());
        if (typeOfTransportation == null) {
            throw new IllegalArgumentException("Loại phương tiện không hợp lệ!");
        }

        UserProfileDTO currentUser = this.userService.getUserByPhone(UserUtils.getCurrentUserDetails().getUsername());
        com.hp.pojo.Service svc = new com.hp.pojo.Service();
        svc.setName(transportation.getBaseInfo().getName());
        svc.setDescription(transportation.getBaseInfo().getDescription());
        svc.setPrice(transportation.getBaseInfo().getPrice());
        svc.setQuantity(transportation.getBaseInfo().getQuantity());
        svc.setIsActive(true);
        Set<Image> images = new HashSet<>();
        for (MultipartFile img : transportation.getBaseInfo().getImgFiles()) {
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
        svc.setTypeOfServiceId(new TypeOfService(3));

        ServiceTransportation additionalInfo = new ServiceTransportation();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");
        String arrivalTm = transportation.getArrivalTm();
        String departureTm = transportation.getDepartureTm();
        Date arrivalTime = sdf.parse(arrivalTm);
        Date departureTime = sdf.parse(departureTm);
        additionalInfo.setArrivalTime(arrivalTime);
        additionalInfo.setDepartureTime(departureTime);
        additionalInfo.setArrivalLocation(transportation.getArrivalLocation());
        additionalInfo.setDepartureLocation(transportation.getDepartureLocation());
        additionalInfo.setTypeOfTransportationId(typeOfTransportation);

        additionalInfo.setServiceId(svc);
        svc.setServiceTransportation(additionalInfo);

        com.hp.pojo.Service addedSvc = this.transportationSvcRepository.addOrUpdateTransportation(svc);

        return this.toDetailTransportationSvcDTO(addedSvc);
    }
}
