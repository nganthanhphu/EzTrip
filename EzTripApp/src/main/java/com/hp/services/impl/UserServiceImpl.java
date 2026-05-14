/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.hp.dto.user.CustomerProfileDTO;
import com.hp.dto.user.ProviderProfileDTO;
import com.hp.dto.user.UserViewDTO;
import com.hp.dto.user.UserRegisterDTO;
import com.hp.pojo.BaseUser;
import com.hp.pojo.CustomerProfile;
import com.hp.pojo.ProviderProfile;
import com.hp.pojo.Gender;
import com.hp.repositories.UserRepository;
import com.hp.security.MyUserDetails;
import com.hp.services.UserService;
import com.hp.services.handler.profile.UserProfileHandler;

import java.io.IOException;
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

        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRoleId().getName()));

        return new MyUserDetails(user.getId(), user.getPhoneNumber(), user.getPassword(), authorities);
    }

    @Override
    public UserViewDTO getUserByPhone(String phoneNumber) {
        BaseUser user = this.userRepository.getUserByPhone(phoneNumber);
        return toUserProfileDTO(user);
    }

    @Override
    public UserViewDTO addUser(UserRegisterDTO u) throws Exception {
        BaseUser user = new BaseUser();
        user.setFullname(u.getFullname());
        user.setEmail(u.getEmail());
        user.setPhoneNumber(u.getPhoneNumber());
        user.setPassword(this.passwordEncoder.encode(u.getPassword()));

        MultipartFile avatar = u.getAvatar();
        if (avatar != null && !avatar.isEmpty()) {
            try {
                Map<?, ?> res = this.cloudinary.uploader().upload(avatar.getBytes(),
                        ObjectUtils.asMap("resource_type", "auto"));
                user.setAvatar(res.get("secure_url").toString());
            } catch (IOException ex) {
                Logger.getLogger(UserServiceImpl.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        String roleName = u.getRole();
        UserProfileHandler handler = this.profileHandlers.get(roleName);

        if (handler == null) {
            throw new Exception("Vai trò không hợp lệ!");
        }

        handler.handleProfileInfo(user, u);

        return toUserProfileDTO(this.userRepository.addUser(user));
    }

    @Override
    public BaseUser authenticate(String phoneNumber, String password) {
        return this.userRepository.authenticate(phoneNumber, password);
    }

    private UserViewDTO toUserProfileDTO(BaseUser user) {
        if (user == null) {
            return null;
        }

        UserViewDTO userDTO = new UserViewDTO();
        userDTO.setId(user.getId());
        userDTO.setFullname(user.getFullname());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setAvatar(user.getAvatar());
        userDTO.setIsActive(user.getIsActive());
        userDTO.setRole(user.getRoleId().getName());

        CustomerProfile customerProfile = user.getCustomerProfile();
        if (customerProfile == null) {
            userDTO.setCustomerProfile(null);
        } else {
            CustomerProfileDTO customerProfileDto = new CustomerProfileDTO();
            customerProfileDto.setId(customerProfile.getId());
            customerProfileDto.setDob(customerProfile.getDob());

            Gender gender = customerProfile.getGenderId();
            if (gender == null) {
                customerProfileDto.setGender(null);
            } else {
                customerProfileDto.setGender(gender.getName());
            }

            userDTO.setCustomerProfile(customerProfileDto);
        }

        ProviderProfile providerProfile = user.getProviderProfile();
        if (providerProfile == null) {
            userDTO.setProviderProfile(null);
        } else {
            ProviderProfileDTO providerProfileDto = new ProviderProfileDTO();
            providerProfileDto.setId(providerProfile.getId());
            providerProfileDto.setCompanyName(providerProfile.getCompanyName());
            providerProfileDto.setCompanyAddress(providerProfile.getCompanyAddress());

            providerProfileDto.setTypeOfProvider(providerProfile.getTypeOfProviderId().getName());
            userDTO.setProviderProfile(providerProfileDto);
        }
        return userDTO;
    }

}
