/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories;

import java.util.List;
import java.util.Map;

import com.hp.pojo.BaseUser;

/**
 *
 * @author Joon
 */
public interface UserRepository {
    BaseUser getUserByPhone(String phoneNumber);
    BaseUser addOrUpdateUser(BaseUser u);
    List<BaseUser> getUsers(Map<String, String> params);
    BaseUser authenticate(String phoneNumber, String password);
    BaseUser getUserById(Integer userId);
    
}
