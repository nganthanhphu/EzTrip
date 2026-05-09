/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services;

import org.springframework.security.core.userdetails.UserDetailsService;

import com.hp.dto.user.UserViewDTO;
import com.hp.dto.user.UserRegisterDTO;

/**
 *
 * @author Joon
 */
public interface UserService extends UserDetailsService {
    UserViewDTO getUserByPhone(String phoneNumber);
    UserViewDTO addUser(UserRegisterDTO request) throws Exception;
    boolean authenticate(String phoneNumber, String password);
}
