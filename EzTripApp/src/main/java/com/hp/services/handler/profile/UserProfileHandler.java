/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.handler.profile;

import com.hp.dto.user.UserCreateDTO;
import com.hp.pojo.BaseUser;
import java.text.ParseException;

/**
 *
 * @author Joon
 */
public interface UserProfileHandler {
    void handleProfileInfo(BaseUser user, UserCreateDTO u) throws ParseException;
}