/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.controllers.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
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
@RequestMapping("/admin")
public class AdminStatsController {

    @Autowired
    private StatsService statsService;

    @GetMapping("/stats")
    public String statsView(Model model, @RequestParam(name = "statsType", defaultValue = "MONTH") String statsType,
            @RequestParam(name = "year", defaultValue = "#{T(java.time.LocalDate).now().getYear()}") int year,
            @RequestParam(name = "serviceId", required = false) Integer serviceId,
            @RequestParam(name = "month", required = false) Integer month) {
        model.addAttribute("statsType", statsType);
        model.addAttribute("year", year);
        model.addAttribute("serviceId", serviceId);
        model.addAttribute("month", month);
        BaseStatsDTO stats = this.statsService.getStats(statsType, year, serviceId, month, false);
        int totalActiveService = this.statsService.getActiveServiceCount(statsType, year, serviceId, month);
        model.addAttribute("totalActiveService", totalActiveService);
        model.addAttribute("stats", stats);
        return "stats";
    }

}
