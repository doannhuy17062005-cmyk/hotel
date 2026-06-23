package com.hotel.booking.repository;

import com.hotel.booking.entity.Booking;
import com.hotel.booking.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByBooking(Booking booking);
    
    Optional<Payment> findByBookingId(Long bookingId);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' " +
           "AND p.paidAt >= :startDate AND p.paidAt <= :endDate")
    Double getTotalPaymentsBetweenDates(@Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate);
}
