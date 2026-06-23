package com.hotel.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsDTO {
    private long totalBookings;
    private long pendingBookings;
    private long confirmedBookings;
    private long completedBookings;
    private long cancelledBookings;
    private long totalRooms;
    private long availableRooms;
    private long occupiedRooms;
    private double occupancyRate;
    private Double totalRevenue;
    private Double monthlyRevenue;
    private Double dailyRevenue;
}
