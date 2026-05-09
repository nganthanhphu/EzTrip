/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories;

import com.hp.pojo.BaseUser;

/**
 *
 * @author Joon
 */
public interface UserRepository {
    BaseUser getUserByPhone(String phoneNumber);
    BaseUser addUser(BaseUser u);
    boolean authenticate(String phoneNumber, String password);
    
}
