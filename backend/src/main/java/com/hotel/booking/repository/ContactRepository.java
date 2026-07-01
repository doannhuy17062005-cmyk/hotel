package com.hotel.booking.repository;

import com.hotel.booking.entity.Contact;
import com.hotel.booking.entity.Contact.ContactStatus;
import com.hotel.booking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    /*
     * Lấy liên hệ của một khách hàng,
     * liên hệ mới nhất được hiển thị trước.
     */
    List<Contact> findByUserOrderByCreatedAtDesc(User user);

    /*
     * Admin lấy toàn bộ liên hệ,
     * liên hệ mới nhất được hiển thị trước.
     */
    List<Contact> findAllByOrderByCreatedAtDesc();

    /*
     * Đếm số phản hồi khách hàng chưa đọc.
     */
    long countByUserAndStatusAndReadByUserFalse(
            User user,
            ContactStatus status
    );
}