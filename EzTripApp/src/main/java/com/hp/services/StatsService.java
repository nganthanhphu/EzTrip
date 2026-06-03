/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services;

import com.hp.dto.stats.BaseStatsDTO;

/**
 *
 * @author Joon
 */
public interface StatsService {
    int getActiveServiceCount(String statsType, int year, Integer serviceId, Integer month);
    BaseStatsDTO getStats(String statsType, int year, Integer serviceId, Integer month, boolean isOnlyActive);
}
