package com.hotel.booking.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "contacts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * Tài khoản khách hàng gửi liên hệ.
     * Một người dùng có thể gửi nhiều liên hệ.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    private String phone;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContactStatus status;

    /*
     * Nội dung Admin trả lời.
     */
    @Column(columnDefinition = "TEXT")
    private String adminReply;

    /*
     * false: khách hàng chưa đọc phản hồi.
     * true: khách hàng đã đọc phản hồi.
     */
    @Column(nullable = false)
    private Boolean readByUser;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime repliedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();

        if (status == null) {
            status = ContactStatus.PENDING;
        }

        if (readByUser == null) {
            readByUser = true;
        }
    }

    public enum ContactStatus {
        PENDING,
        REPLIED
    }
}