/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.handler.profile;

import com.hp.dto.user.UserRegisterDTO;
import com.hp.pojo.BaseUser;

/**
 *
 * @author Joon
 */
public interface UserProfileHandler {
    void handleProfileInfo(BaseUser user, UserRegisterDTO u) throws Exception;
}