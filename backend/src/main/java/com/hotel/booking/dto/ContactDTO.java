package com.hotel.booking.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactDTO {

    private Long id;

    private Long userId;

    private String fullName;

    private String email;

    private String phone;

    private String subject;

    private String content;

    private String status;

    private String adminReply;

    private Boolean readByUser;

    private LocalDateTime createdAt;

    private LocalDateTime repliedAt;
}