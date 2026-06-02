/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.hp.dto.stats.BaseStatsDTO;
import com.hp.services.StatsService;

/**
 *
 * @author Joon
 */
@Controller
@RequestMapping("/api")
public class ApiStatsController {

    @Autowired
    private StatsService statsService;

    @PreAuthorize("hasRole('PROVIDER')")
    @GetMapping("/secure/stats")
    public ResponseEntity<BaseStatsDTO> getStats(@RequestParam(name = "statsType") String statsType,
            @RequestParam(name = "year") int year,
            @RequestParam(name = "serviceId", required = false) Integer serviceId,
            @RequestParam(name = "month", required = false) Integer month) {
        BaseStatsDTO stats = this.statsService.getStats(statsType, year, serviceId, month);
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }
}
