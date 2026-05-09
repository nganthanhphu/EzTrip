/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.handler.profile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.hp.dto.user.UserRegisterDTO;
import com.hp.pojo.BaseUser;
import com.hp.pojo.ProviderProfile;
import com.hp.pojo.Role;
import com.hp.pojo.TypeOfProvider;
import com.hp.repositories.RoleRepository;
import com.hp.repositories.TypeOfProviderRepository;

/**
 *
 * @author Joon
 */
@Component("PROVIDER")
public class ProviderProfileHandler implements UserProfileHandler {

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private TypeOfProviderRepository typeOfProviderRepo;

    @Override
    public void handleProfileInfo(BaseUser user, UserRegisterDTO u) throws Exception {
        String roleName = u.getRole();
        Role role = roleRepo.getRoleByName(roleName);
        if (role == null || !role.getName().equals("PROVIDER")) {
            throw new Exception("Vai trò không hợp lệ!");
        }
        user.setRoleId(role);

        ProviderProfile profile = new ProviderProfile();
        profile.setUserId(user);

        profile.setCompanyName(u.getCompanyName());
        profile.setCompanyAddress(u.getCompanyAddress());

        String typeOfProviderName = u.getTypeOfProvider();
        TypeOfProvider typeOfProvider = typeOfProviderRepo.getTypeOfProviderByName(typeOfProviderName);
        if (typeOfProvider == null) {
            throw new Exception("Loại nhà cung cấp không hợp lệ!");
        }
        profile.setTypeOfProviderId(typeOfProvider);

        user.setProviderProfile(profile);
        user.setIsActive(false);
    }
}
