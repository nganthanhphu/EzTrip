/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.handler.profile;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import org.springframework.stereotype.Component;

import com.hp.dto.user.UserCreateDTO;
import com.hp.pojo.BaseUser;
import com.hp.pojo.CustomerProfile;
import com.hp.pojo.Gender;
import com.hp.pojo.Role;

/**
 *
 * @author Joon
 */
@Component("ROLE_2")
public class CustomProfileHandler implements UserProfileHandler {

    @Override
    public void handleProfileInfo(BaseUser user, UserCreateDTO u) throws ParseException {
        Integer roleId = u.role();
        user.setRoleId(new Role(roleId));

        CustomerProfile profile = new CustomerProfile();
        profile.setUserId(user);

        Integer genderId = u.gender();
        profile.setGenderId(new Gender(genderId));

        String dobString = u.dob();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date dob = sdf.parse(dobString);
        profile.setDob(dob);

        user.setCustomerProfile(profile);
        user.setIsActive(true);

    }
}
