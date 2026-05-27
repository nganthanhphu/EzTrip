/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories;

import com.hp.pojo.Service;

/**
 *
 * @author Joon
 */
public interface BaseServiceRepository {
    Object[] getServiceForBookingValidation(int id);
    void addOrUpdateService(Service svc);
}
