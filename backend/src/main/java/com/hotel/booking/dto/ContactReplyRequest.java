package com.hotel.booking.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ContactReplyRequest {

    @NotBlank(message = "Nội dung phản hồi không được để trống")
    private String reply;
}