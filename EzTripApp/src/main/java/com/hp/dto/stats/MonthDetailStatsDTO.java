/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Record.java to edit this template
 */
package com.hp.dto.stats;

/**
 *
 * @author Joon
 */
public record MonthDetailStatsDTO(
        int month,
        int revenue,
        int confirmedBookingCount,
        int completedBookingCount,
        int cancelledBookingCount
    ) {

}
