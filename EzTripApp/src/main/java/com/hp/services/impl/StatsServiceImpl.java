/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hp.dto.stats.BaseStatsDTO;
import com.hp.dto.stats.DayDetailStatsDTO;
import com.hp.dto.stats.MonthDetailStatsDTO;
import com.hp.dto.stats.MonthStatsByDayDTO;
import com.hp.dto.stats.QuarterDetailStatsDTO;
import com.hp.dto.stats.YearStatsByMonthDTO;
import com.hp.dto.stats.YearStatsByQuarterDTO;
import com.hp.repositories.StatsRepository;
import com.hp.security.MyUserDetails;
import com.hp.services.StatsService;
import com.hp.utils.UserUtils;

/**
 *
 * @author Joon
 */
@Service
@Transactional
public class StatsServiceImpl implements StatsService {

    @Autowired
    private StatsRepository statsRepository;

    @Override
    public int getActiveServiceCount(String statsType, int year, Integer serviceId, Integer month) {
        return this.statsRepository.getServiceCount(year, null, serviceId, month, true);
    }

    @Override
    public BaseStatsDTO getStats(String statsType, int year, Integer serviceId, Integer month, boolean isOnlyActive) {
        Integer providerId = null;
        MyUserDetails userDetails = UserUtils.getCurrentUserDetails();

        if (userDetails != null) {
            if (userDetails.getAuthorities().stream().findFirst().get().getAuthority().equals("ROLE_PROVIDER")) {
                if (userDetails.getProviderId() != null)
                    providerId = userDetails.getProviderId();
            }
        }

        int totalService = this.statsRepository.getServiceCount(year, providerId, serviceId, month, isOnlyActive);

        List<Object[]> statsData = this.statsRepository.getStats(statsType, year, providerId, serviceId, month);

        switch (statsType) {
            case "DAY":
                if (month != null) {
                    return toMonthStatsByDayDTO(statsData, totalService);
                }
                else return null;
            case "MONTH":
                return toYearStatsByMonthDTO(statsData, totalService);
            case "QUARTER":
                return toYearStatsByQuarterDTO(statsData, totalService);
            default:
                throw new IllegalArgumentException("Tham số lấy dữ liệu thống kê không hợp lệ!");
        }
    }

    private DayDetailStatsDTO toDayDetailStatsDTO(Object[] stat) {
        return new DayDetailStatsDTO(
                (int) stat[0],
                (int) stat[1],
                (int) stat[2],
                (int) stat[3],
                (int) stat[4]);
    }

    private QuarterDetailStatsDTO toQuarterDetailStatsDTO(Object[] stat) {
        return new QuarterDetailStatsDTO(
                (int) stat[0],
                (int) stat[1],
                (int) stat[2],
                (int) stat[3],
                (int) stat[4]);
    }

    private MonthDetailStatsDTO toMonthDetailStatsDTO(Object[] stat) {
        return new MonthDetailStatsDTO(
                (int) stat[0],
                (int) stat[1],
                (int) stat[2],
                (int) stat[3],
                (int) stat[4]);
    }

    private MonthStatsByDayDTO toMonthStatsByDayDTO(List<Object[]> statsData, int totalService) {
        List<DayDetailStatsDTO> days = new ArrayList<>();

        int totalConfirmedBooking = 0, totalCompletedBooking = 0, totalCancelledBooking = 0;
        int totalRevenue = 0;

        for (Object[] stat : statsData) {
            days.add(toDayDetailStatsDTO(stat));
            totalConfirmedBooking += (int) stat[2];
            totalCompletedBooking += (int) stat[3];
            totalCancelledBooking += (int) stat[4];
            totalRevenue += (int) stat[1];
        }

        return new MonthStatsByDayDTO(totalRevenue, totalService, totalConfirmedBooking, totalCompletedBooking,
                totalCancelledBooking, days);

    }

    private YearStatsByMonthDTO toYearStatsByMonthDTO(List<Object[]> statsData, int totalService) {
        List<MonthDetailStatsDTO> months = new ArrayList<>();

        int totalConfirmedBooking = 0, totalCompletedBooking = 0, totalCancelledBooking = 0;
        int totalRevenue = 0;

        for (Object[] stat : statsData) {
            months.add(toMonthDetailStatsDTO(stat));
            totalConfirmedBooking += (int) stat[2];
            totalCompletedBooking += (int) stat[3];
            totalCancelledBooking += (int) stat[4];
            totalRevenue += (int) stat[1];
        }

        return new YearStatsByMonthDTO(totalRevenue, totalService, totalConfirmedBooking, totalCompletedBooking,
                totalCancelledBooking, months);

    }

    private YearStatsByQuarterDTO toYearStatsByQuarterDTO(List<Object[]> statsData, int totalService) {
        List<QuarterDetailStatsDTO> quarters = new ArrayList<>();

        int totalConfirmedBooking = 0, totalCompletedBooking = 0, totalCancelledBooking = 0;
        int totalRevenue = 0;

        for (Object[] stat : statsData) {
            quarters.add(toQuarterDetailStatsDTO(stat));
            totalConfirmedBooking += (int) stat[2];
            totalCompletedBooking += (int) stat[3];
            totalCancelledBooking += (int) stat[4];
            totalRevenue += (int) stat[1];
        }

        return new YearStatsByQuarterDTO(totalRevenue, totalService, totalConfirmedBooking, totalCompletedBooking,
                totalCancelledBooking, quarters);

    }
}
