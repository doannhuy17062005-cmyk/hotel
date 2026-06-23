package com.hotel.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RoomTypeRequest {
    @NotBlank(message = "Tên loại phòng không được để trống")
    private String name;
    
    private String description;
    
    @NotNull(message = "Giá cơ bản không được để trống")
    @Positive(message = "Giá cơ bản phải lớn hơn 0")
    private BigDecimal basePrice;
}
