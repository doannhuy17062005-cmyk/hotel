package com.hotel.booking.controller;

import com.hotel.booking.dto.ContactDTO;
import com.hotel.booking.dto.ContactReplyRequest;
import com.hotel.booking.dto.ContactRequest;
import com.hotel.booking.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    /*
     * KHÁCH HÀNG GỬI LIÊN HỆ
     * POST /api/contacts
     */
    @PostMapping("/contacts")
    public ResponseEntity<ContactDTO> createContact(
            Authentication authentication,
            @Valid @RequestBody ContactRequest request
    ) {
        ContactDTO result = contactService.createContact(
                authentication.getName(),
                request
        );

        return ResponseEntity.ok(result);
    }

    /*
     * KHÁCH HÀNG XEM CÁC LIÊN HỆ CỦA MÌNH
     * GET /api/contacts/my
     */
    @GetMapping("/contacts/my")
    public ResponseEntity<List<ContactDTO>> getMyContacts(
            Authentication authentication
    ) {
        List<ContactDTO> contacts =
                contactService.getMyContacts(
                        authentication.getName()
                );

        return ResponseEntity.ok(contacts);
    }

    /*
     * ĐẾM SỐ PHẢN HỒI CHƯA ĐỌC
     * GET /api/contacts/unread-count
     */
    @GetMapping("/contacts/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            Authentication authentication
    ) {
        long count = contactService.getUnreadCount(
                authentication.getName()
        );

        return ResponseEntity.ok(
                Map.of("count", count)
        );
    }

    /*
     * KHÁCH HÀNG ĐÁNH DẤU ĐÃ ĐỌC
     * PUT /api/contacts/{id}/read
     */
    @PutMapping("/contacts/{id}/read")
    public ResponseEntity<ContactDTO> markAsRead(
            @PathVariable Long id,
            Authentication authentication
    ) {
        ContactDTO result = contactService.markAsRead(
                id,
                authentication.getName()
        );

        return ResponseEntity.ok(result);
    }

    /*
     * ADMIN LẤY TOÀN BỘ LIÊN HỆ
     * GET /api/admin/contacts
     */
    @GetMapping("/admin/contacts")
    public ResponseEntity<List<ContactDTO>> getAllContacts() {
        return ResponseEntity.ok(
                contactService.getAllContacts()
        );
    }

    /*
     * ADMIN XEM CHI TIẾT LIÊN HỆ
     * GET /api/admin/contacts/{id}
     */
    @GetMapping("/admin/contacts/{id}")
    public ResponseEntity<ContactDTO> getContactById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                contactService.getContactById(id)
        );
    }

    /*
     * ADMIN TRẢ LỜI LIÊN HỆ
     * PUT /api/admin/contacts/{id}/reply
     */
    @PutMapping("/admin/contacts/{id}/reply")
    public ResponseEntity<ContactDTO> replyContact(
            @PathVariable Long id,
            @Valid @RequestBody ContactReplyRequest request
    ) {
        return ResponseEntity.ok(
                contactService.replyContact(id, request)
        );
    }
}