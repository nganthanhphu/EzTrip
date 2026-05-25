/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services;

import java.text.ParseException;

import org.springframework.security.core.userdetails.UserDetailsService;

import com.hp.dto.user.UserProfileDTO;
import com.hp.pojo.BaseUser;
import com.hp.dto.user.UserRegisterDTO;

/**
 *
 * @author Joon
 */
public interface UserService extends UserDetailsService {
    UserProfileDTO getUserByPhone(String phoneNumber);
    UserProfileDTO addUser(UserRegisterDTO request) throws ParseException;
    BaseUser authenticate(String phoneNumber, String password);
}
