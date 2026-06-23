package com.hotel.booking.controller;

import com.hotel.booking.dto.RoomDTO;
import com.hotel.booking.dto.RoomTypeDTO;
import com.hotel.booking.service.RoomService;
import com.hotel.booking.service.RoomTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RoomController {
    
    private final RoomService roomService;
    private final RoomTypeService roomTypeService;
    
    @GetMapping("/rooms")
    public ResponseEntity<List<RoomDTO>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }
    
    @GetMapping("/rooms/{id}")
    public ResponseEntity<RoomDTO> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }
    
    @GetMapping("/rooms/search")
    public ResponseEntity<List<RoomDTO>> searchRooms(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(required = false) Integer guests,
            @RequestParam(required = false) Long roomTypeId) {
        
        return ResponseEntity.ok(roomService.searchAvailableRooms(checkIn, checkOut, guests, roomTypeId));
    }
    
    @GetMapping("/room-types")
    public ResponseEntity<List<RoomTypeDTO>> getAllRoomTypes() {
        return ResponseEntity.ok(roomTypeService.getAllRoomTypes());
    }
    
    @GetMapping("/room-types/{id}")
    public ResponseEntity<RoomTypeDTO> getRoomTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(roomTypeService.getRoomTypeById(id));
    }
}
