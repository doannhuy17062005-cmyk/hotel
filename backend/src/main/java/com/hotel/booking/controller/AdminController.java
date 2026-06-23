package com.hotel.booking.controller;

import com.hotel.booking.dto.*;
import com.hotel.booking.service.BookingService;
import com.hotel.booking.service.RoomService;
import com.hotel.booking.service.RoomTypeService;
import com.hotel.booking.service.StatisticsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    
    private final RoomService roomService;
    private final RoomTypeService roomTypeService;
    private final BookingService bookingService;
    private final StatisticsService statisticsService;
    
    // Room management
    @PostMapping("/rooms")
    public ResponseEntity<RoomDTO> createRoom(@Valid @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.createRoom(request));
    }
    
    @PutMapping("/rooms/{id}")
    public ResponseEntity<RoomDTO> updateRoom(@PathVariable Long id, @Valid @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.updateRoom(id, request));
    }
    
    @PutMapping("/rooms/{id}/status")
    public ResponseEntity<RoomDTO> updateRoomStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(roomService.updateRoomStatus(id, body.get("status")));
    }
    
    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok().build();
    }
    
    // Room type management
    @PostMapping("/room-types")
    public ResponseEntity<RoomTypeDTO> createRoomType(@Valid @RequestBody RoomTypeRequest request) {
        return ResponseEntity.ok(roomTypeService.createRoomType(request));
    }
    
    @PutMapping("/room-types/{id}")
    public ResponseEntity<RoomTypeDTO> updateRoomType(@PathVariable Long id, @Valid @RequestBody RoomTypeRequest request) {
        return ResponseEntity.ok(roomTypeService.updateRoomType(id, request));
    }
    
    @DeleteMapping("/room-types/{id}")
    public ResponseEntity<Void> deleteRoomType(@PathVariable Long id) {
        roomTypeService.deleteRoomType(id);
        return ResponseEntity.ok().build();
    }
    
    // Booking management
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
    
    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<BookingDTO> updateBookingStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, body.get("status")));
    }
    
    // Statistics
    @GetMapping("/statistics")
    public ResponseEntity<StatisticsDTO> getStatistics() {
        return ResponseEntity.ok(statisticsService.getStatistics());
    }
}
