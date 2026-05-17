/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import java.io.IOException;
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
import com.hp.dto.service.DetailBaseServiceDTO;
import com.hp.dto.service.DetailTourismSvcDTO;
import com.hp.dto.service.ListViewTourismSvcDTO;
import com.hp.dto.user.UserViewDTO;
import com.hp.pojo.Image;
import com.hp.pojo.ProviderProfile;
import com.hp.pojo.ServiceTourism;
import com.hp.pojo.TypeOfService;
import com.hp.repositories.TourismSvcRepository;
import com.hp.services.TourismSvcService;
import com.hp.services.UserService;
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
    private UserService userService;

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public List<ListViewTourismSvcDTO> getTourismServices(Map<String, String> params) {
        return this.tourismSvcRepository.getTourismServices(params);
    }

    @Override
    public DetailTourismSvcDTO getTourismById(Integer id) {
        com.hp.pojo.Service svc = this.tourismSvcRepository.getTourismById(id);
        return this.toDetailTourismSvcDTO(svc);
    }

    private DetailTourismSvcDTO toDetailTourismSvcDTO(com.hp.pojo.Service svc) {
        if (svc == null)
            return null;

        DetailBaseServiceDTO baseInfo = new DetailBaseServiceDTO();
        baseInfo.setId(svc.getId());
        baseInfo.setName(svc.getName());
        baseInfo.setDescription(svc.getDescription());
        baseInfo.setPrice(svc.getPrice());
        baseInfo.setQuantity(svc.getQuantity());
        Set<String> images = svc.getImageSet().stream().map(img -> img.getUrl()).collect(Collectors.toSet());
        baseInfo.setImages(images);
        DetailTourismSvcDTO detail = new DetailTourismSvcDTO();
        detail.setBaseInfo(baseInfo);
        detail.setId(svc.getServiceTourism().getId());
        detail.setStartDate(svc.getServiceTourism().getStartDate());
        detail.setEndDate(svc.getServiceTourism().getEndDate());
        detail.setLocation(svc.getServiceTourism().getLocation());
        return detail;
    }

    @Override
    public DetailTourismSvcDTO addTourism(DetailTourismSvcDTO tourism) throws Exception {
        UserViewDTO currentUser = this.userService.getUserByPhone(UserUtils.getCurrentUserDetails().getUsername());
        com.hp.pojo.Service svc = new com.hp.pojo.Service();
        svc.setName(tourism.getBaseInfo().getName());
        svc.setDescription(tourism.getBaseInfo().getDescription());
        svc.setPrice(tourism.getBaseInfo().getPrice());
        svc.setQuantity(tourism.getBaseInfo().getQuantity());
        svc.setIsActive(true);
        Set<Image> images = new HashSet<>();
        for (MultipartFile img : tourism.getBaseInfo().getImgFiles()) {
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
        svc.setTypeOfServiceId(new TypeOfService(1));

        ServiceTourism additionalInfo = new ServiceTourism();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String startDt = tourism.getStartDt();
        String endDt = tourism.getEndDt();
        Date startDate = sdf.parse(startDt);
        Date endDate = sdf.parse(endDt);
        additionalInfo.setStartDate(startDate);
        additionalInfo.setEndDate(endDate);
        additionalInfo.setLocation(tourism.getLocation());

        additionalInfo.setServiceId(svc);
        svc.setServiceTourism(additionalInfo);

        com.hp.pojo.Service addedSvc = this.tourismSvcRepository.addOrUpdateTourism(svc);

        return this.toDetailTourismSvcDTO(addedSvc);
    }
}
