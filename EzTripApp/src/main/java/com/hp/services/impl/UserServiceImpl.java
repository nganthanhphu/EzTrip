/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.hp.dto.user.CustomerViewDTO;
import com.hp.dto.user.ProviderViewDTO;
import com.hp.dto.user.UserCreateDTO;
import com.hp.dto.user.UserUpdateDTO;
import com.hp.dto.user.UserViewDTO;
import com.hp.pojo.BaseUser;
import com.hp.pojo.CustomerProfile;
import com.hp.pojo.ProviderProfile;
import com.hp.pojo.Gender;
import com.hp.repositories.UserRepository;
import com.hp.security.MyUserDetails;
import com.hp.services.UserService;
import com.hp.services.handler.profile.UserProfileHandler;
import com.hp.utils.UserUtils;

import java.io.IOException;
import java.text.ParseException;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author Joon
 */
@Service("userDetailsService")
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private Map<String, UserProfileHandler> profileHandlers;

    @Override
    public UserDetails loadUserByUsername(String phoneNumber) throws UsernameNotFoundException {
        BaseUser user = this.userRepository.getUserByPhone(phoneNumber);
        if (user == null) {
            throw new UsernameNotFoundException("Người dùng không tồn tại!");
        }

        Integer customerId = null;
        if (user.getCustomerProfile() != null) {
            customerId = user.getCustomerProfile().getId();
        }

        Integer providerId = null;
        String providerType = null;
        if (user.getProviderProfile() != null) {
            providerId = user.getProviderProfile().getId();
            providerType = user.getProviderProfile().getTypeOfProviderId().getName();
        }

        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRoleId().getName()));

        return new MyUserDetails(user.getId(), customerId, providerId, providerType, user.getPhoneNumber(), user.getPassword(),
                authorities);
    }

    @Override
    public UserViewDTO getUserByPhone(String phoneNumber) {
        BaseUser user = this.userRepository.getUserByPhone(phoneNumber);
        return toUserProfileDTO(user);
    }

    @Override
    public UserViewDTO addUser(UserCreateDTO u) throws ParseException {
        BaseUser user = new BaseUser();
        user.setFullname(u.fullname());
        user.setEmail(u.email());
        user.setPhoneNumber(u.phoneNumber());
        user.setPassword(this.passwordEncoder.encode(u.password()));

        Integer roleId = u.role();
        UserProfileHandler handler = this.profileHandlers.get("ROLE_" + roleId);

        if (handler == null) {
            throw new IllegalArgumentException("Vai trò không hợp lệ!");
        }

        handler.handleProfileCreate(user, u);

        MultipartFile avatar = u.avatar();
        if (avatar != null && !avatar.isEmpty()) {
            try {
                Map<?, ?> res = this.cloudinary.uploader().upload(avatar.getBytes(),
                        ObjectUtils.asMap("resource_type", "auto"));
                user.setAvatar(res.get("secure_url").toString());
            } catch (IOException ex) {
                Logger.getLogger(UserServiceImpl.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        return toUserProfileDTO(this.userRepository.addOrUpdateUser(user));
    }

    @Override
    public UserViewDTO updateUser(UserUpdateDTO request) throws ParseException {
        String currentUserPhoneNumber = UserUtils.getCurrentUserDetails().getUsername();

        BaseUser currentUser = this.userRepository.getUserByPhone(currentUserPhoneNumber);
        
        if (request.fullname() != null && !request.fullname().isEmpty())
            currentUser.setFullname(request.fullname());

        if (request.email() != null && !request.email().isEmpty())
            currentUser.setEmail(request.email());

        if (request.newPassword() != null && !request.newPassword().isEmpty()) {
            if (request.oldPassword() == null || request.oldPassword().isEmpty()) {
                throw new IllegalArgumentException("Mật khẩu cũ không được để trống!");
            }

            if (!this.passwordEncoder.matches(request.oldPassword(), currentUser.getPassword())) {
                throw new IllegalArgumentException("Mật khẩu cũ không đúng!");
            }

            currentUser.setPassword(this.passwordEncoder.encode(request.newPassword()));
        }

        MultipartFile avatar = request.avatar();
        if (avatar != null && !avatar.isEmpty()) {
            try {
                Map<?, ?> res = this.cloudinary.uploader().upload(avatar.getBytes(),
                        ObjectUtils.asMap("resource_type", "auto"));
                currentUser.setAvatar(res.get("secure_url").toString());
            } catch (IOException ex) {
                Logger.getLogger(UserServiceImpl.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        Integer roleId = currentUser.getRoleId().getId();
        UserProfileHandler handler = this.profileHandlers.get("ROLE_" + roleId);

        if (handler != null)
            handler.handleProfileUpdate(currentUser, request);

        return toUserProfileDTO(this.userRepository.addOrUpdateUser(currentUser));
    }

    @Override
    public BaseUser authenticate(String phoneNumber, String password) {
        return this.userRepository.authenticate(phoneNumber, password);
    }

    private UserViewDTO toUserProfileDTO(BaseUser user) {
        if (user == null) {
            return null;
        }

        CustomerViewDTO customerProfileDto = null;
        CustomerProfile customerProfile = user.getCustomerProfile();
        if (customerProfile != null) {
            Gender gender = customerProfile.getGenderId();
            Integer genderId = null;
            if (gender != null) {
                genderId = gender.getId();
            }
            customerProfileDto = new CustomerViewDTO(
                    customerProfile.getId(),
                    customerProfile.getDob(),
                    genderId);
        }

        ProviderViewDTO providerProfileDto = null;
        ProviderProfile providerProfile = user.getProviderProfile();
        if (providerProfile != null) {
            providerProfileDto = new ProviderViewDTO(
                    providerProfile.getId(),
                    providerProfile.getCompanyName(),
                    providerProfile.getCompanyAddress(),
                    providerProfile.getTypeOfProviderId().getId());
        }

        return new UserViewDTO(
                user.getId(),
                user.getFullname(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getAvatar(),
                user.getIsActive(),
                user.getRoleId().getId(),
                customerProfileDto,
                providerProfileDto);
    }

}
