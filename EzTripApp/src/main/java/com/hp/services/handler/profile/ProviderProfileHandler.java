/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.handler.profile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.hp.dto.user.UserCreateDTO;
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
    public void handleProfileInfo(BaseUser user, UserCreateDTO u) {
        String roleName = u.role();
        Role role = roleRepo.getRoleByName(roleName);
        if (role == null || !role.getName().equals("PROVIDER")) {
            throw new IllegalArgumentException("Vai trò không hợp lệ!");
        }
        user.setRoleId(role);

        ProviderProfile profile = new ProviderProfile();
        profile.setUserId(user);

        profile.setCompanyName(u.companyName());
        profile.setCompanyAddress(u.companyAddress());

        String typeOfProviderName = u.typeOfProvider();
        TypeOfProvider typeOfProvider = typeOfProviderRepo.getTypeOfProviderByName(typeOfProviderName);
        if (typeOfProvider == null) {
            throw new IllegalArgumentException("Loại nhà cung cấp không hợp lệ!");
        }
        profile.setTypeOfProviderId(typeOfProvider);

        user.setProviderProfile(profile);
        user.setIsActive(false);
    }
}
