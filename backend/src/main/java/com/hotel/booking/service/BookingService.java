package com.hotel.booking.service;

import com.hotel.booking.dto.BookingDTO;
import com.hotel.booking.dto.BookingRequest;
import com.hotel.booking.entity.*;
import com.hotel.booking.repository.BookingRepository;
import com.hotel.booking.repository.PaymentRepository;
import com.hotel.booking.repository.RoomRepository;
import com.hotel.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final VNPayService vnPayService;
    
    public List<BookingDTO> getUserBookings(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        return bookingRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(BookingDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(BookingDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt phòng"));
        return BookingDTO.fromEntity(booking);
    }
    
    @Transactional
    public BookingDTO createBooking(String email, BookingRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng"));
        
        // 1. Kiểm tra trạng thái phòng - phòng phải AVAILABLE
        if (room.getStatus() != Room.RoomStatus.AVAILABLE) {
            String statusMessage = room.getStatus() == Room.RoomStatus.MAINTENANCE 
                ? "Phòng đang bảo trì, không thể đặt" 
                : "Phòng không khả dụng để đặt";
            throw new RuntimeException(statusMessage);
        }
        
        // 2. Kiểm tra ngày check-in không được trong quá khứ
        LocalDate today = LocalDate.now();
        if (request.getCheckInDate().isBefore(today)) {
            throw new RuntimeException("Ngày nhận phòng không thể là ngày trong quá khứ");
        }
        
        // 3. Kiểm tra ngày check-out phải sau check-in
        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new RuntimeException("Ngày trả phòng phải sau ngày nhận phòng");
        }
        
        // 4. Giới hạn số ngày đặt tối đa (30 ngày)
        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        if (nights > 30) {
            throw new RuntimeException("Thời gian đặt phòng tối đa là 30 ngày");
        }
        
        // 5. Kiểm tra xung đột với các booking khác (phòng đã được đặt trong khoảng thời gian này)
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                room.getId(), request.getCheckInDate(), request.getCheckOutDate());
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Phòng đã được đặt trong khoảng thời gian này. Vui lòng chọn ngày khác.");
        }
        
        // 6. Kiểm tra sức chứa
        if (request.getNumGuests() > room.getCapacity()) {
            throw new RuntimeException("Số khách (" + request.getNumGuests() + ") vượt quá sức chứa của phòng (" + room.getCapacity() + " người)");
        }
        
        // 7. Tính tổng tiền
        BigDecimal totalPrice = room.getPrice().multiply(BigDecimal.valueOf(nights));
        
        Booking booking = Booking.builder()
                .user(user)
                .room(room)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .numGuests(request.getNumGuests())
                .totalPrice(totalPrice)
                .status(Booking.BookingStatus.PENDING)
                .build();
        
        bookingRepository.save(booking);
        
        // Create payment record
        Payment.PaymentMethod paymentMethod = Payment.PaymentMethod.CASH;
        if (request.getPaymentMethod() != null) {
            try {
                paymentMethod = Payment.PaymentMethod.valueOf(request.getPaymentMethod());
            } catch (IllegalArgumentException ignored) {}
        }
        
        Payment payment = Payment.builder()
                .booking(booking)
                .amount(totalPrice)
                .paymentMethod(paymentMethod)
                .status(Payment.PaymentStatus.PENDING)
                .build();
        
        paymentRepository.save(payment);
        booking.setPayment(payment);
        
        BookingDTO dto = BookingDTO.fromEntity(booking);
        
        // Nếu thanh toán online -> tạo VNPay URL
        if (paymentMethod == Payment.PaymentMethod.ONLINE) {
            String orderInfo = "Thanh toan dat phong " + room.getRoomNumber();
            String paymentUrl = vnPayService.createPaymentUrl(
                    booking.getId(), 
                    totalPrice.longValue(), 
                    orderInfo
            );
            dto.setPaymentUrl(paymentUrl);
        }
        
        return dto;
    }
    
    @Transactional
    public BookingDTO updateBookingStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt phòng"));
        
        Booking.BookingStatus newStatus = Booking.BookingStatus.valueOf(status);
        booking.setStatus(newStatus);
        
        // Update payment status if booking is completed
        if (newStatus == Booking.BookingStatus.COMPLETED && booking.getPayment() != null) {
            Payment payment = booking.getPayment();
            payment.setStatus(Payment.PaymentStatus.COMPLETED);
            payment.setPaidAt(LocalDateTime.now());
            paymentRepository.save(payment);
        }
        
        bookingRepository.save(booking);
        return BookingDTO.fromEntity(booking);
    }
    
    @Transactional
    public BookingDTO cancelBooking(Long id, String email) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt phòng"));
        
        // Check if user owns the booking
        if (!booking.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Bạn chỉ có thể hủy đặt phòng của mình");
        }
        
        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new RuntimeException("Không thể hủy đặt phòng đã hoàn thành");
        }
        
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        
        return BookingDTO.fromEntity(booking);
    }
}
