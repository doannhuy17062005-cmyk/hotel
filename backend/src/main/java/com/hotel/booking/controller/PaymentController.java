package com.hotel.booking.controller;

import com.hotel.booking.entity.Booking;
import com.hotel.booking.entity.Payment;
import com.hotel.booking.repository.BookingRepository;
import com.hotel.booking.repository.PaymentRepository;
import com.hotel.booking.service.VNPayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    
    private final VNPayService vnPayService;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    
    /**
     * VNPay Return URL - Xử lý kết quả thanh toán từ VNPay
     * Frontend gọi API này sau khi user được redirect về từ VNPay
     */
    @GetMapping("/vnpay-return")
    public ResponseEntity<Map<String, Object>> vnpayReturn(@RequestParam Map<String, String> params) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate callback signature
            boolean isValid = vnPayService.validateCallback(params);
            
            if (!isValid) {
                response.put("success", false);
                response.put("message", "Chữ ký không hợp lệ");
                return ResponseEntity.badRequest().body(response);
            }
            
            String responseCode = params.get("vnp_ResponseCode");
            String txnRef = params.get("vnp_TxnRef");
            
            Long bookingId = vnPayService.extractBookingId(txnRef);
            
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt phòng"));
            
            Payment payment = paymentRepository.findByBookingId(bookingId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy thanh toán"));
            
            // Xử lý kết quả thanh toán
            if ("00".equals(responseCode)) {
                // Thanh toán thành công
                payment.setStatus(Payment.PaymentStatus.COMPLETED);
                payment.setPaidAt(LocalDateTime.now());
                paymentRepository.save(payment);
                
                booking.setStatus(Booking.BookingStatus.CONFIRMED);
                bookingRepository.save(booking);
                
                response.put("success", true);
                response.put("message", "Thanh toán thành công");
                response.put("bookingId", bookingId);
                response.put("transactionNo", params.get("vnp_TransactionNo"));
            } else {
                // Thanh toán thất bại
                payment.setStatus(Payment.PaymentStatus.FAILED);
                paymentRepository.save(payment);
                
                response.put("success", false);
                response.put("message", getVNPayErrorMessage(responseCode));
                response.put("bookingId", bookingId);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Lỗi xử lý thanh toán: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    private String getVNPayErrorMessage(String responseCode) {
        return switch (responseCode) {
            case "07" -> "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).";
            case "09" -> "Giao dịch không thành công do: Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking.";
            case "10" -> "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần.";
            case "11" -> "Giao dịch không thành công do: Đã hết hạn chờ thanh toán.";
            case "12" -> "Giao dịch không thành công do: Thẻ/Tài khoản bị khóa.";
            case "13" -> "Giao dịch không thành công do: Quý khách nhập sai mật khẩu xác thực OTP.";
            case "24" -> "Giao dịch không thành công do: Khách hàng hủy giao dịch.";
            case "51" -> "Giao dịch không thành công do: Tài khoản không đủ số dư.";
            case "65" -> "Giao dịch không thành công do: Tài khoản đã vượt quá hạn mức giao dịch trong ngày.";
            case "75" -> "Ngân hàng thanh toán đang bảo trì.";
            case "79" -> "Giao dịch không thành công do: Quý khách nhập sai mật khẩu thanh toán quá số lần quy định.";
            default -> "Giao dịch không thành công. Mã lỗi: " + responseCode;
        };
    }
}


