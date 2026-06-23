package com.hotel.booking.service;

import com.hotel.booking.dto.RoomTypeDTO;
import com.hotel.booking.dto.RoomTypeRequest;
import com.hotel.booking.entity.RoomType;
import com.hotel.booking.repository.RoomTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomTypeService {
    
    private final RoomTypeRepository roomTypeRepository;
    
    public List<RoomTypeDTO> getAllRoomTypes() {
        return roomTypeRepository.findAll().stream()
                .map(RoomTypeDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public RoomTypeDTO getRoomTypeById(Long id) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phòng"));
        return RoomTypeDTO.fromEntity(roomType);
    }
    
    public RoomTypeDTO createRoomType(RoomTypeRequest request) {
        if (roomTypeRepository.existsByName(request.getName())) {
            throw new RuntimeException("Tên loại phòng đã tồn tại");
        }
        
        RoomType roomType = RoomType.builder()
                .name(request.getName())
                .description(request.getDescription())
                .basePrice(request.getBasePrice())
                .build();
        
        roomTypeRepository.save(roomType);
        return RoomTypeDTO.fromEntity(roomType);
    }
    
    public RoomTypeDTO updateRoomType(Long id, RoomTypeRequest request) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phòng"));
        
        roomType.setName(request.getName());
        roomType.setDescription(request.getDescription());
        roomType.setBasePrice(request.getBasePrice());
        
        roomTypeRepository.save(roomType);
        return RoomTypeDTO.fromEntity(roomType);
    }
    
    public void deleteRoomType(Long id) {
        if (!roomTypeRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy loại phòng");
        }
        roomTypeRepository.deleteById(id);
    }
}
