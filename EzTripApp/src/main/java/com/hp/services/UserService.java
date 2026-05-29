/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services;

import java.text.ParseException;

import org.springframework.security.core.userdetails.UserDetailsService;

import com.hp.dto.user.UserCreateDTO;
import com.hp.dto.user.UserUpdateDTO;
import com.hp.dto.user.UserViewDTO;
import com.hp.pojo.BaseUser;

/**
 *
 * @author Joon
 */
public interface UserService extends UserDetailsService {
    UserViewDTO getUserByPhone(String phoneNumber);
    UserViewDTO addUser(UserCreateDTO request) throws ParseException;
    UserViewDTO updateUser(UserUpdateDTO request) throws ParseException;
    BaseUser authenticate(String phoneNumber, String password);
}
