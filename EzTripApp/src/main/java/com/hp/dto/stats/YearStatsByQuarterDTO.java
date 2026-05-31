/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Record.java to edit this template
 */
package com.hp.dto.stats;

import java.util.List;

/**
 *
 * @author Joon
 */
public record YearStatsByQuarterDTO(
        int totalRevenue,
        int totalService,
        int totalConfirmedBooking,
        int totalCompletedBooking,
        int totalCancelledBooking,
        List<QuarterDetailStatsDTO> quarters) implements BaseStatsDTO{

}
