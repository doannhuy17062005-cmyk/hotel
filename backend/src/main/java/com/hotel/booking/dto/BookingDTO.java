package com.hotel.booking.dto;

import com.hotel.booking.entity.Booking;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long id;
    private Long userId;
    private String userFullName;
    private String userEmail;
    private Long roomId;
    private String roomNumber;
    private String roomTypeName;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numGuests;
    private BigDecimal totalPrice;
    private String status;
    private LocalDateTime createdAt;
    private String paymentStatus;
    private String paymentUrl; // URL thanh toán VNPay (nếu có)
    
    public static BookingDTO fromEntity(Booking booking) {
        BookingDTO dto = BookingDTO.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userFullName(booking.getUser().getFullName())
                .userEmail(booking.getUser().getEmail())
                .roomId(booking.getRoom().getId())
                .roomNumber(booking.getRoom().getRoomNumber())
                .roomTypeName(booking.getRoom().getRoomType().getName())
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .numGuests(booking.getNumGuests())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus().name())
                .createdAt(booking.getCreatedAt())
                .build();
        
        if (booking.getPayment() != null) {
            dto.setPaymentStatus(booking.getPayment().getStatus().name());
        }
        
        return dto;
    }
}
