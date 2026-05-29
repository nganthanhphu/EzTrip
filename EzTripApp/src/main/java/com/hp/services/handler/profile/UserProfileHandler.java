/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.handler.profile;

import com.hp.dto.user.UserCreateDTO;
import com.hp.dto.user.UserUpdateDTO;
import com.hp.pojo.BaseUser;
import java.text.ParseException;

/**
 *
 * @author Joon
 */
public interface UserProfileHandler {
    void handleProfileCreate(BaseUser user, UserCreateDTO u) throws ParseException;
    void handleProfileUpdate(BaseUser user, UserUpdateDTO u) throws ParseException;
}