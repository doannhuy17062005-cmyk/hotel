package com.hotel.booking.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequest {
    @NotNull(message = "Mã phòng không được để trống")
    private Long roomId;
    
    @NotNull(message = "Ngày nhận phòng không được để trống")
    @FutureOrPresent(message = "Ngày nhận phòng phải từ hôm nay trở đi")
    private LocalDate checkInDate;
    
    @NotNull(message = "Ngày trả phòng không được để trống")
    @Future(message = "Ngày trả phòng phải trong tương lai")
    private LocalDate checkOutDate;
    
    @NotNull(message = "Số khách không được để trống")
    @Positive(message = "Số khách phải lớn hơn 0")
    private Integer numGuests;
    
    private String paymentMethod;
}
