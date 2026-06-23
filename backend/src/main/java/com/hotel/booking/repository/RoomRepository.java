package com.hotel.booking.repository;

import com.hotel.booking.entity.Room;
import com.hotel.booking.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
       Optional<Room> findByRoomNumber(String roomNumber);
       
       List<Room> findByRoomType(RoomType roomType);
       
       List<Room> findByStatus(Room.RoomStatus status);
       
       @Query("SELECT r FROM Room r WHERE r.capacity >= :guests AND r.status = 'AVAILABLE' " +
              "AND r.id NOT IN (SELECT b.room.id FROM Booking b WHERE " +
              "b.status != 'CANCELLED' AND " +
              "((b.checkInDate <= :checkOut AND b.checkOutDate >= :checkIn)))")
       List<Room> findAvailableRooms(@Param("checkIn") LocalDate checkIn,
                                   @Param("checkOut") LocalDate checkOut,
                                   @Param("guests") Integer guests);
                                   @Query("SELECT r FROM Room r WHERE r.roomType.id = :roomTypeId AND r.capacity >= :guests " +
              "AND r.status = 'AVAILABLE' AND r.id NOT IN (SELECT b.room.id FROM Booking b WHERE " +
              "b.status != 'CANCELLED' AND " +
              "((b.checkInDate <= :checkOut AND b.checkOutDate >= :checkIn)))")
       List<Room> findAvailableRoomsByType(@Param("roomTypeId") Long roomTypeId,
                                          @Param("checkIn") LocalDate checkIn,
                                          @Param("checkOut") LocalDate checkOut,
                                          @Param("guests") Integer guests);
       
       @Query("SELECT COUNT(r) FROM Room r WHERE r.status = :status")
       long countByStatus(@Param("status") Room.RoomStatus status);
}
