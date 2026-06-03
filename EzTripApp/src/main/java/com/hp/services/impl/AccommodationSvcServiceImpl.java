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
import com.hp.dto.service.AccommodationCreateDTO;
import com.hp.dto.service.AccommodationListViewDTO;
import com.hp.dto.service.AccommodationUpdateDTO;
import com.hp.dto.service.AccommodationViewDTO;
import com.hp.dto.service.BaseServiceCreateDTO;
import com.hp.dto.service.BaseServiceUpdateDTO;
import com.hp.pojo.Image;
import com.hp.pojo.ProviderProfile;
import com.hp.pojo.ServiceAccommodation;
import com.hp.pojo.TypeOfService;
import com.hp.repositories.AccommodationSvcRepository;
import com.hp.repositories.BaseServiceRepository;
import com.hp.security.MyUserDetails;
import com.hp.services.AccommodationSvcService;
import com.hp.services.ResourceAuthorizationService;
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
    private BaseServiceRepository baseServiceRepository;

    @Autowired
    private ResourceAuthorizationService resourceAuthorizationService;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    @Qualifier("GeminiChatClient")
    private ChatClient chatClient;

    @Override
    public List<AccommodationListViewDTO> getAccommodationServices(Map<String, String> params) {
        int providerId = 0;

        MyUserDetails userDetails = UserUtils.getCurrentUserDetails();

        if (userDetails != null) {
            if (userDetails.getAuthorities().stream().findFirst().get().getAuthority().equals("ROLE_PROVIDER")) {
                if (userDetails.getProviderId() != null)
                    providerId = userDetails.getProviderId();
            }
        }

        return this.accommodationSvcRepository.getAccommodationServices(params, providerId);
    }

    @Override
    public AccommodationViewDTO getAccommodationById(Integer id) {
        return this.accommodationSvcRepository.getAccommodationById(id);
    }

    @Override
    public void addAccommodation(AccommodationCreateDTO accommodation) throws ParseException {
        if (!UserUtils.getCurrentUserDetails().getIsActive())
            throw new RuntimeException(
                    "Tài khoản của bạn không có quyền do chưa được kích hoạt. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.");

        BaseServiceCreateDTO baseInfo = accommodation.baseInfo();
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
        svc.setTypeOfServiceId(new TypeOfService(2));

        ServiceAccommodation additionalInfo = new ServiceAccommodation();

        additionalInfo.setQuantityOfBed(accommodation.quantityOfBed());
        additionalInfo.setArea(accommodation.area());
        additionalInfo.setLocation(accommodation.location());

        additionalInfo.setServiceId(svc);
        svc.setServiceAccommodation(additionalInfo);

        this.baseServiceRepository.addOrUpdateService(svc);
    }

    @Override
    public void updateAccommodation(Integer id, AccommodationUpdateDTO accommodation) throws ParseException {
        if (!UserUtils.getCurrentUserDetails().getIsActive())
            throw new RuntimeException(
                    "Tài khoản của bạn không có quyền do chưa được kích hoạt. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.");

        com.hp.pojo.Service svc = this.resourceAuthorizationService.getServiceForUpdate(id);

        BaseServiceUpdateDTO baseInfo = accommodation.baseInfo();

        if (baseInfo.name() != null && !baseInfo.name().isEmpty())
            svc.setName(baseInfo.name());

        if (baseInfo.description() != null && !baseInfo.description().isEmpty())
            svc.setDescription(baseInfo.description());

        if (baseInfo.price() != null)
            svc.setPrice(baseInfo.price());

        if (baseInfo.quantity() != null)
            svc.setQuantity(baseInfo.quantity());

        ServiceAccommodation additionalInfo = svc.getServiceAccommodation();

        if (accommodation.quantityOfBed() != null)
            additionalInfo.setQuantityOfBed(accommodation.quantityOfBed());

        if (accommodation.area() != null)
            additionalInfo.setArea(accommodation.area());

        if (accommodation.location() != null && !accommodation.location().isEmpty())
            additionalInfo.setLocation(accommodation.location());

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
        svc.setServiceAccommodation(additionalInfo);
        this.baseServiceRepository.addOrUpdateService(svc);
    }

    @Override
    public void deleteAccommodation(Integer id) {
        if (!UserUtils.getCurrentUserDetails().getIsActive())
            throw new RuntimeException(
                    "Tài khoản của bạn không có quyền do chưa được kích hoạt. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.");

        com.hp.pojo.Service svc = this.resourceAuthorizationService.getServiceForUpdate(id);
        svc.setIsActive(false);
        this.baseServiceRepository.addOrUpdateService(svc);
    }

    @Override
    public String compareAccommodationServices(Integer svcId1, Integer svcId2, Integer svcId3) {
        List<AccommodationViewDTO> accommodations = new ArrayList<>();
        if (svcId1 != null) {
            AccommodationViewDTO accommodation1 = this.getAccommodationById(svcId1);
            if (accommodation1 != null) {
                accommodations.add(accommodation1);
            }
        }
        if (svcId2 != null) {
            AccommodationViewDTO accommodation2 = this.getAccommodationById(svcId2);
            if (accommodation2 != null) {
                accommodations.add(accommodation2);
            }
        }
        if (svcId3 != null) {
            AccommodationViewDTO accommodation3 = this.getAccommodationById(svcId3);
            if (accommodation3 != null) {
                accommodations.add(accommodation3);
            }
        }

        ObjectMapper mapper = new ObjectMapper();

        String result = "Không đủ dữ liệu để so sánh! Vui lòng chọn ít nhất 2 dịch vụ trở lên.";

        if (accommodations.size() > 0) {
            try {
                String prompt = String.format("Thực hiện so sánh các loại dịch vụ lưu trú sau: %s",
                        mapper.writeValueAsString(accommodations));

                result = this.chatClient.prompt().user(prompt).call().content();
            } catch (JsonProcessingException e) {

            }

        }

        return result;
    }

}
