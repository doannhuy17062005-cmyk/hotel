package com.hotel.booking.dto;

import com.hotel.booking.entity.Room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomDTO {
    private Long id;
    private String roomNumber;
    private Long roomTypeId;
    private String roomTypeName;
    private String description;
    private BigDecimal price;
    private Integer capacity;
    private String status;
    private String imageUrl;
    
    public static RoomDTO fromEntity(Room room) {
        return RoomDTO.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .roomTypeId(room.getRoomType().getId())
                .roomTypeName(room.getRoomType().getName())
                .description(room.getDescription())
                .price(room.getPrice())
                .capacity(room.getCapacity())
                .status(room.getStatus().name())
                .imageUrl(room.getImageUrl())
                .build();
    }
}
