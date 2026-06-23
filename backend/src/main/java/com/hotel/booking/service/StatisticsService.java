package com.hotel.booking.service;

import com.hotel.booking.dto.StatisticsDTO;
import com.hotel.booking.entity.Booking;
import com.hotel.booking.entity.Room;
import com.hotel.booking.repository.BookingRepository;
import com.hotel.booking.repository.PaymentRepository;
import com.hotel.booking.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class StatisticsService {
    
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final PaymentRepository paymentRepository;
    
    public StatisticsDTO getStatistics() {
        // Booking statistics
        long totalBookings = bookingRepository.count();
        long pendingBookings = bookingRepository.countByStatus(Booking.BookingStatus.PENDING);
        long confirmedBookings = bookingRepository.countByStatus(Booking.BookingStatus.CONFIRMED);
        long completedBookings = bookingRepository.countByStatus(Booking.BookingStatus.COMPLETED);
        long cancelledBookings = bookingRepository.countByStatus(Booking.BookingStatus.CANCELLED);
        
        // Room statistics
        long totalRooms = roomRepository.count();
        long availableRooms = roomRepository.countByStatus(Room.RoomStatus.AVAILABLE);
        long occupiedRooms = roomRepository.countByStatus(Room.RoomStatus.OCCUPIED);
        
        double occupancyRate = totalRooms > 0 ? (double) occupiedRooms / totalRooms * 100 : 0;
        
        // Revenue statistics - Calculate from Payment table (completed payments)
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.with(LocalTime.MIN);
        LocalDateTime endOfDay = now.with(LocalTime.MAX);
        LocalDateTime startOfMonth = now.withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime startOfYear = now.withDayOfYear(1).with(LocalTime.MIN);
        
        Double dailyRevenue = paymentRepository.getTotalPaymentsBetweenDates(startOfDay, endOfDay);
        Double monthlyRevenue = paymentRepository.getTotalPaymentsBetweenDates(startOfMonth, endOfDay);
        Double totalRevenue = paymentRepository.getTotalPaymentsBetweenDates(startOfYear, endOfDay);
        
        return StatisticsDTO.builder()
                .totalBookings(totalBookings)
                .pendingBookings(pendingBookings)
                .confirmedBookings(confirmedBookings)
                .completedBookings(completedBookings)
                .cancelledBookings(cancelledBookings)
                .totalRooms(totalRooms)
                .availableRooms(availableRooms)
                .occupiedRooms(occupiedRooms)
                .occupancyRate(occupancyRate)
                .dailyRevenue(dailyRevenue != null ? dailyRevenue : 0.0)
                .monthlyRevenue(monthlyRevenue != null ? monthlyRevenue : 0.0)
                .totalRevenue(totalRevenue != null ? totalRevenue : 0.0)
                .build();
    }
}

