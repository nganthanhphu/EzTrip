/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.handler.profile;

import org.springframework.stereotype.Component;

import com.hp.dto.user.UserCreateDTO;
import com.hp.pojo.BaseUser;
import com.hp.pojo.ProviderProfile;
import com.hp.pojo.Role;
import com.hp.pojo.TypeOfProvider;

/**
 *
 * @author Joon
 */
@Component("ROLE_3")
public class ProviderProfileHandler implements UserProfileHandler {

    @Override
    public void handleProfileInfo(BaseUser user, UserCreateDTO u) {
        Integer roleId = u.role();
        user.setRoleId(new Role(roleId));

        ProviderProfile profile = new ProviderProfile();
        profile.setUserId(user);

        profile.setCompanyName(u.companyName());
        profile.setCompanyAddress(u.companyAddress());

        Integer typeOfProviderId = u.typeOfProvider();
        profile.setTypeOfProviderId(new TypeOfProvider(typeOfProviderId));

        user.setProviderProfile(profile);
        user.setIsActive(false);
    }
}
