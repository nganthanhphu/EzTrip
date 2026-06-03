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
import com.hp.services.ResourceAuthorizationService;
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
    private ResourceAuthorizationService resourceAuthorizationService;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    @Qualifier("GeminiChatClient")
    private ChatClient chatClient;

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
        if (!UserUtils.getCurrentUserDetails().getIsActive())
            throw new RuntimeException(
                    "Tài khoản của bạn không có quyền do chưa được kích hoạt. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.");

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
        if (!UserUtils.getCurrentUserDetails().getIsActive())
            throw new RuntimeException(
                    "Tài khoản của bạn không có quyền do chưa được kích hoạt. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.");

        com.hp.pojo.Service svc = this.resourceAuthorizationService.getServiceForUpdate(id);

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

    @Override
    public void deleteTransportation(Integer id) {
        if (!UserUtils.getCurrentUserDetails().getIsActive())
            throw new RuntimeException(
                    "Tài khoản của bạn không có quyền do chưa được kích hoạt. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.");

        com.hp.pojo.Service svc = this.resourceAuthorizationService.getServiceForUpdate(id);
        svc.setIsActive(false);
        this.baseServiceRepository.addOrUpdateService(svc);
    }

    @Override
    public String compareTransportationServices(Integer svcId1, Integer svcId2, Integer svcId3) {
        List<TransportationViewDTO> transportationServices = new ArrayList<>();
        if (svcId1 != null) {
            TransportationViewDTO transportation1 = this.getTransportationById(svcId1);
            if (transportation1 != null) {
                transportationServices.add(transportation1);
            }
        }
        if (svcId2 != null) {
            TransportationViewDTO transportation2 = this.getTransportationById(svcId2);
            if (transportation2 != null) {
                transportationServices.add(transportation2);
            }
        }
        if (svcId3 != null) {
            TransportationViewDTO transportation3 = this.getTransportationById(svcId3);
            if (transportation3 != null) {
                transportationServices.add(transportation3);
            }
        }

        ObjectMapper mapper = new ObjectMapper();

        String result = "Không đủ dữ liệu để so sánh! Vui lòng chọn ít nhất 2 dịch vụ trở lên.";

        if (transportationServices.size() > 0) {
            try {
                String typeOfTransportationInfo = """
                        Các loại hình vận chuyển tương ứng với giá trị typeOfTransportation như sau:
                                1: Xe buýt,
                                2: Máy bay,
                                3: Tàu hỏa,
                                4: Thuê xe
                                 """;
                String prompt = String.format("Thực hiện so sánh các loại dịch vụ vận chuyển sau: %s\nBiết rằng: %s",
                        mapper.writeValueAsString(transportationServices), typeOfTransportationInfo);

                result = this.chatClient.prompt().user(prompt).call().content();
            } catch (JsonProcessingException e) {

            }

        }

        return result;
    }

}
