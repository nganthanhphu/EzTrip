/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.handler.profile;

import java.time.Instant;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.hp.dto.user.UserRegisterDTO;
import com.hp.pojo.BaseUser;
import com.hp.pojo.CustomerProfile;
import com.hp.pojo.Gender;
import com.hp.pojo.Role;
import com.hp.repositories.GenderRepository;
import com.hp.repositories.RoleRepository;

/**
 *
 * @author Joon
 */
@Component("CUSTOMER")
public class CustomProfileHandler implements UserProfileHandler {

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private GenderRepository genderRepo;

    @Override
    public void handleProfileInfo(BaseUser user, UserRegisterDTO u) throws Exception {
        String roleName = u.getRole();
        Role role = roleRepo.getRoleByName(roleName);
        if (role == null || !role.getName().equals("CUSTOMER")) {
            throw new IllegalArgumentException("Vai trò không hợp lệ!");
        }
        user.setRoleId(role);

        CustomerProfile profile = new CustomerProfile();
        profile.setUserId(user);

        String genderName = u.getGender();
        Gender gender = genderRepo.getGenderByName(genderName);
        if (gender == null) {
            throw new Exception("Giới tính không hợp lệ!");
        }
        profile.setGenderId(gender);

        String dobString = u.getDob();
        Instant dob = Instant.parse(dobString);
        profile.setDob(Date.from(dob));

        user.setCustomerProfile(profile);
        user.setIsActive(true);
        
    }
}
