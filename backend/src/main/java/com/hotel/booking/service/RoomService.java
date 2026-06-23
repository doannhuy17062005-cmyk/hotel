package com.hotel.booking.service;

import com.hotel.booking.dto.RoomDTO;
import com.hotel.booking.dto.RoomRequest;
import com.hotel.booking.entity.Room;
import com.hotel.booking.entity.RoomType;
import com.hotel.booking.repository.RoomRepository;
import com.hotel.booking.repository.RoomTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {
    
    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;
    
    public List<RoomDTO> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(RoomDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public RoomDTO getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng"));
        return RoomDTO.fromEntity(room);
    }
    
    public List<RoomDTO> searchAvailableRooms(LocalDate checkIn, LocalDate checkOut, Integer guests, Long roomTypeId) {
        // Set default guests if null
        if (guests == null || guests < 1) {
            guests = 1;
        }
        
        final Integer guestFilter = guests;
        final Long typeFilter = roomTypeId;
        
        // Nếu không có ngày, trả về tất cả phòng có status AVAILABLE và đủ sức chứa
        if (checkIn == null || checkOut == null) {
            return getAllRooms().stream()
                    .filter(r -> "AVAILABLE".equals(r.getStatus()))
                    .filter(r -> r.getCapacity() >= guestFilter)
                    .filter(r -> typeFilter == null || r.getRoomTypeId().equals(typeFilter))
                    .collect(Collectors.toList());
        }
        
        // Validate: check-in không được trong quá khứ
        LocalDate today = LocalDate.now();
        if (checkIn.isBefore(today)) {
            throw new RuntimeException("Ngày nhận phòng không thể là ngày trong quá khứ");
        }
        
        // Validate: check-out phải sau check-in
        if (!checkOut.isAfter(checkIn)) {
            throw new RuntimeException("Ngày trả phòng phải sau ngày nhận phòng");
        }
        
        // Nếu có roomTypeId, dùng query riêng
        if (roomTypeId != null) {
            return roomRepository.findAvailableRoomsByType(roomTypeId, checkIn, checkOut, guestFilter).stream()
                    .map(RoomDTO::fromEntity)
                    .collect(Collectors.toList());
        }
        
        return roomRepository.findAvailableRooms(checkIn, checkOut, guestFilter).stream()
                .map(RoomDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<RoomDTO> searchAvailableRoomsByType(Long roomTypeId, LocalDate checkIn, 
                                                     LocalDate checkOut, Integer guests) {
        if (guests == null) {
            guests = 1;
        }
        
        return roomRepository.findAvailableRoomsByType(roomTypeId, checkIn, checkOut, guests).stream()
                .map(RoomDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public RoomDTO createRoom(RoomRequest request) {
        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phòng"));
        
        Room room = Room.builder()
                .roomNumber(request.getRoomNumber())
                .roomType(roomType)
                .description(request.getDescription())
                .price(request.getPrice())
                .capacity(request.getCapacity())
                .status(Room.RoomStatus.AVAILABLE)
                .imageUrl(request.getImageUrl())
                .build();
        
        roomRepository.save(room);
        return RoomDTO.fromEntity(room);
    }
    
    public RoomDTO updateRoom(Long id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng"));
        
        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phòng"));
        
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(roomType);
        room.setDescription(request.getDescription());
        room.setPrice(request.getPrice());
        room.setCapacity(request.getCapacity());
        room.setImageUrl(request.getImageUrl());
        
        roomRepository.save(room);
        return RoomDTO.fromEntity(room);
    }
    
    public RoomDTO updateRoomStatus(Long id, String status) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng"));
        
        room.setStatus(Room.RoomStatus.valueOf(status));
        roomRepository.save(room);
        return RoomDTO.fromEntity(room);
    }
    
    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy phòng");
        }
        roomRepository.deleteById(id);
    }
}
