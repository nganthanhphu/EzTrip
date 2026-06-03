/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hp.dto.service.BaseServiceCreateDTO;
import com.hp.dto.service.BaseServiceUpdateDTO;
import com.hp.dto.service.TourismCreateDTO;
import com.hp.dto.service.TourismListViewDTO;
import com.hp.dto.service.TourismUpdateDTO;
import com.hp.dto.service.TourismViewDTO;
import com.hp.pojo.Image;
import com.hp.pojo.ProviderProfile;
import com.hp.pojo.ServiceTourism;
import com.hp.pojo.TypeOfService;
import com.hp.repositories.BaseServiceRepository;
import com.hp.repositories.TourismSvcRepository;
import com.hp.security.MyUserDetails;
import com.hp.services.ResourceAuthorizationService;
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
    private BaseServiceRepository baseServiceRepository;

    @Autowired
    private ResourceAuthorizationService resourceAuthorizationService;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    @Qualifier("GeminiChatClient")
    private ChatClient chatClient;

    @Override
    public List<TourismListViewDTO> getTourismServices(Map<String, String> params) {
        int providerId = 0;

        MyUserDetails userDetails = UserUtils.getCurrentUserDetails();

        if (userDetails != null) {
            if (userDetails.getAuthorities().stream().findFirst().get().getAuthority().equals("ROLE_PROVIDER")) {
                if (userDetails.getProviderId() != null)
                    providerId = userDetails.getProviderId();
            }
        }

        return this.tourismSvcRepository.getTourismServices(params, providerId);
    }

    @Override
    public TourismViewDTO getTourismById(Integer id) {
        return this.tourismSvcRepository.getTourismById(id);
    }

    @Override
    public void addTourism(TourismCreateDTO tourism) throws ParseException {
        if (!UserUtils.getCurrentUserDetails().getIsActive())
            throw new RuntimeException(
                    "Tài khoản của bạn không có quyền do chưa được kích hoạt. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.");

        BaseServiceCreateDTO baseInfo = tourism.baseInfo();
        Integer providerId = UserUtils.getCurrentUserDetails().getProviderId();
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

        svc.setProviderId(new ProviderProfile(providerId));
        svc.setTypeOfServiceId(new TypeOfService(1));

        ServiceTourism additionalInfo = new ServiceTourism();
        additionalInfo.setTourDuration(tourism.tourDuration());
        additionalInfo.setLocation(tourism.location());

        additionalInfo.setServiceId(svc);
        svc.setServiceTourism(additionalInfo);

        this.baseServiceRepository.addOrUpdateService(svc);
    }

    @Override
    public void updateTourism(Integer id, TourismUpdateDTO tourism) throws ParseException {
        if (!UserUtils.getCurrentUserDetails().getIsActive())
            throw new RuntimeException(
                    "Tài khoản của bạn không có quyền do chưa được kích hoạt. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.");

        com.hp.pojo.Service svc = this.resourceAuthorizationService.getServiceForUpdate(id);

        BaseServiceUpdateDTO baseInfo = tourism.baseInfo();

        if (baseInfo.name() != null && !baseInfo.name().isEmpty())
            svc.setName(baseInfo.name());

        if (baseInfo.description() != null && !baseInfo.description().isEmpty())
            svc.setDescription(baseInfo.description());

        if (baseInfo.price() != null)
            svc.setPrice(baseInfo.price());

        if (baseInfo.quantity() != null)
            svc.setQuantity(baseInfo.quantity());

        ServiceTourism additionalInfo = svc.getServiceTourism();

        if (tourism.tourDuration() != null)
            additionalInfo.setTourDuration(tourism.tourDuration());

        if (tourism.location() != null && !tourism.location().isEmpty())
            additionalInfo.setLocation(tourism.location());

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
        svc.setServiceTourism(additionalInfo);
        this.baseServiceRepository.addOrUpdateService(svc);

    }

    @Override
    public void deleteTourism(Integer id) {
        if (!UserUtils.getCurrentUserDetails().getIsActive())
            throw new RuntimeException(
                    "Tài khoản của bạn không có quyền do chưa được kích hoạt. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.");

        com.hp.pojo.Service svc = this.resourceAuthorizationService.getServiceForUpdate(id);
        svc.setIsActive(false);
        this.baseServiceRepository.addOrUpdateService(svc);
    }

    @Override
    public String compareTourismServices(Integer svcId1, Integer svcId2, Integer svcId3) {
        List<TourismViewDTO> tourismServices = new ArrayList<>();
        if (svcId1 != null) {
            TourismViewDTO tourism1 = this.getTourismById(svcId1);
            if (tourism1 != null) {
                tourismServices.add(tourism1);
            }
        }
        if (svcId2 != null) {
            TourismViewDTO tourism2 = this.getTourismById(svcId2);
            if (tourism2 != null) {
                tourismServices.add(tourism2);
            }
        }
        if (svcId3 != null) {
            TourismViewDTO tourism3 = this.getTourismById(svcId3);
            if (tourism3 != null) {
                tourismServices.add(tourism3);
            }
        }

        ObjectMapper mapper = new ObjectMapper();

        String result = "Không đủ dữ liệu để so sánh! Vui lòng chọn ít nhất 2 dịch vụ trở lên.";

        if (tourismServices.size() > 0) {
            try {
                String prompt = String.format("Thực hiện so sánh các loại dịch vụ du lịch sau: %s",
                        mapper.writeValueAsString(tourismServices));
                result = this.chatClient.prompt().user(prompt).call().content();
            } catch (JsonProcessingException e) {

            }
        }

        return result;
    }

}
