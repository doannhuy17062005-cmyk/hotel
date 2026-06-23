package com.hotel.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RoomRequest {
    @NotBlank(message = "Số phòng không được để trống")
    private String roomNumber;
    
    @NotNull(message = "Loại phòng không được để trống")
    private Long roomTypeId;
    
    private String description;
    
    @NotNull(message = "Giá phòng không được để trống")
    @Positive(message = "Giá phòng phải lớn hơn 0")
    private BigDecimal price;
    
    @NotNull(message = "Sức chứa không được để trống")
    @Positive(message = "Sức chứa phải lớn hơn 0")
    private Integer capacity;
    
    private String imageUrl;
}
