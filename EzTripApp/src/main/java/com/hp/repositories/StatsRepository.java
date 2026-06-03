/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories;

import java.util.List;

/**
 *
 * @author Joon
 */
public interface StatsRepository {

    int getServiceCount(int year, Integer providerId, Integer serviceId, Integer month, boolean isOnlyActive);

    List<Object[]> getStats(String statsType, int year, Integer providerId, Integer serviceId, Integer month);
    
}
