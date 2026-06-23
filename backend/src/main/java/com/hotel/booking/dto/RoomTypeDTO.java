package com.hotel.booking.dto;

import com.hotel.booking.entity.RoomType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomTypeDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal basePrice;
    
    public static RoomTypeDTO fromEntity(RoomType roomType) {
        return RoomTypeDTO.builder()
                .id(roomType.getId())
                .name(roomType.getName())
                .description(roomType.getDescription())
                .basePrice(roomType.getBasePrice())
                .build();
    }
}
